import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); // Refresh list
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Create Ticket Section */}
        <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          🎫 Create Ticket
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-200"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ticket Title"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Ticket Description"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          ></textarea>

          <button
            className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-90 text-white font-semibold transition disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "✨ Submit Ticket"}
          </button>
        </form>

        {/* Tickets List */}
        <h2 className="text-3xl font-bold mb-4 text-indigo-700">
          📋 All Tickets
        </h2>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Link
              key={ticket._id}
              className="block bg-white border border-gray-200 p-5 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              to={`/tickets/${ticket._id}`}
            >
              <h3 className="font-bold text-lg text-purple-700">
                {ticket.title}
              </h3>
              <p className="text-gray-600 mt-1">{ticket.description}</p>
              <p className="text-sm text-blue-600 mt-2">
                Created At: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
          {tickets.length === 0 && (
            <p className="text-gray-700 font-medium">
              🚀 No tickets submitted yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
