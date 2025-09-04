import { createAgent, gemini } from "@inngest/agent-kit";
const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Ticket Triage Assistant",
    system: `You are an expert AI assistant that processes technical support tickets. 

Your job:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes for moderators.
4. List relevant skills.

IMPORTANT:
Respond with only valid raw JSON, no markdown or code fences.`,
  });

  const response =
    await supportAgent.run(`Analyze the following ticket and return ONLY valid JSON:

- title: ${ticket.title}
- description: ${ticket.description}

Required fields:
{
  "summary": "short summary",
  "priority": "low|medium|high",
  "helpfulNotes": "detailed notes",
  "relatedSkills": ["skill1","skill2"]
}`);

  // Safely extract raw text
  const raw = response.output[0]?.context || "{}";
  let parsed = {};

  try {
    // Try to parse JSON even if wrapped in ```json
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonString = match ? match[1] : raw.trim();
    parsed = JSON.parse(jsonString);
  } catch (e) {
    console.log("Failed to parse JSON from AI response:", e.message);
  }

  // Return safe object
  return {
    summary: parsed.summary || ticket.title,
    priority: ["low", "medium", "high"].includes(parsed.priority)
      ? parsed.priority
      : "medium",
    helpfulNotes: parsed.helpfulNotes || "No helpful notes provided",
    relatedSkills: Array.isArray(parsed.relatedSkills)
      ? parsed.relatedSkills
      : [],
  };
};

export default analyzeTicket;
