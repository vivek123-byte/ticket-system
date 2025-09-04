import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-indigo-600 font-medium">Loading ticket details...</p>
      </div>
    );

  if (!ticket)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 font-semibold">Ticket not found ❌</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        🎟️ Ticket Details
      </h2>

      <div className="card bg-white shadow-xl rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">
            {ticket.title}
          </h3>
          <p className="text-gray-600 mt-2">{ticket.description}</p>
        </div>

        {ticket.status && (
          <>
            <div className="divider">📌 Metadata</div>

            <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className="badge badge-info">{ticket.status}</span>
              </p>

              {ticket.priority && (
                <p>
                  <span className="font-semibold">Priority:</span>{" "}
                  <span className="badge badge-warning">{ticket.priority}</span>
                </p>
              )}

              {ticket.relatedSkills?.length > 0 && (
                <p className="sm:col-span-2">
                  <span className="font-semibold">Related Skills:</span>{" "}
                  {ticket.relatedSkills.join(", ")}
                </p>
              )}

              {ticket.assignedTo && (
                <p>
                  <span className="font-semibold">Assigned To:</span>{" "}
                  {ticket.assignedTo?.email}
                </p>
              )}

              {ticket.createdAt && (
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Created At:</span>{" "}
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              )}
            </div>

            {ticket.helpfulNotes && (
              <div>
                <strong className="block text-gray-800 mb-2">
                  📝 Helpful Notes:
                </strong>
                <div className="prose prose-indigo max-w-none bg-gray-50 p-4 rounded-lg border">
                  <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
