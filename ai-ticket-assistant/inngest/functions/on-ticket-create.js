import { inngest } from "../client.js";
import mongoose from "mongoose";
import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      // 0️⃣ Ensure MongoDB is connected
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("MongoDB connected inside Inngest function");
      }

      // 1️⃣ Fetch the ticket
      const ticket = await step.run("fetch-ticket", async () => {
        const t = await Ticket.findById(ticketId);
        if (!t) throw new NonRetriableError("Ticket not found");
        return t;
      });
      console.log("Ticket fetched:", ticket);

      // 2️⃣ Initialize ticket status
      await step.run("update-ticket-status", async () => {
        const updated = await Ticket.findByIdAndUpdate(
          ticket._id,
          { status: "TODO" },
          { new: true }
        );
        if (!updated) throw new NonRetriableError("Failed to initialize ticket status");
        console.log("Ticket status initialized to TODO");
      });

      // 3️⃣ Run AI analysis on the ticket
      let aiResponse;
      try {
        aiResponse = await analyzeTicket(ticket);
        console.log("AI Response:", aiResponse);
      } catch (err) {
        console.error("AI analysis failed, using defaults:", err);
        aiResponse = { priority: "medium", helpfulNotes: "", relatedSkills: [] };
      }

      // 4️⃣ Update ticket with AI analysis
      const relatedSkills = await step.run("ai-processing", async () => {
        const updatedTicket = await Ticket.findByIdAndUpdate(
          ticket._id,
          {
            priority: ["low", "medium", "high"].includes(aiResponse.priority)
              ? aiResponse.priority
              : "medium",
            helpfulNotes: aiResponse.helpfulNotes || "",
            status: "IN_PROGRESS",
            relatedSkills: aiResponse.relatedSkills || [],
          },
          { new: true }
        );
        if (!updatedTicket) throw new NonRetriableError("Failed to update ticket with AI info");
        console.log("Ticket updated with AI info:", updatedTicket);
        return updatedTicket.relatedSkills || [];
      });

      // 5️⃣ Assign a moderator/admin
      const moderator = await step.run("assign-moderator", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: { $in: relatedSkills },
        });

        if (!user) {
          user = await User.findOne({ role: "admin" });
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
          ticket._id,
          { assignedTo: user?._id || null },
          { new: true }
        );
        if (!updatedTicket) throw new NonRetriableError("Failed to assign moderator");

        console.log("Moderator assigned:", user?.email || "No moderator found");
        return user;
      });

      // 6️⃣ Send email notification
      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = await Ticket.findById(ticket._id);
          await sendMail(
            moderator.email,
            "Ticket Assigned",
            `A new ticket is assigned to you: ${finalTicket.title}`
          );
          console.log(`Email sent to ${moderator.email}`);
        }
      });

      return { success: true };
    } catch (err) {
      console.error("❌ Error in on-ticket-created function:", err);
      return { success: false };
    }
  }
);