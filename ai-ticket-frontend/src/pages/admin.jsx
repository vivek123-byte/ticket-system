import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({ role: user.role, skills: user.skills?.join(", ") });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: editingUser,
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Failed to update user");
        return;
      }

      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(query))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          🔧 Admin Panel - Manage Users
        </h1>

        <input
          type="text"
          className="w-full mb-6 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-500 shadow-sm"
          placeholder="Search by email"
          value={searchQuery}
          onChange={handleSearch}
        />

        {filteredUsers.map((user) => {
          const isEditing = editingUser === user.email;

          return (
            <div
              key={user._id}
              className={`p-6 rounded-2xl shadow-lg mb-4 border transition transform hover:-translate-y-1 hover:shadow-xl
                ${
                  isEditing
                    ? "bg-indigo-50 border-indigo-400"
                    : "bg-white border-gray-200"
                }
              `}
            >
              <p>
                <strong className="text-gray-700">Email:</strong>{" "}
                <span
                  className={`${
                    isEditing ? "text-black" : "text-indigo-600"
                  } font-medium`}
                >
                  {user.email}
                </span>
              </p>
              <p>
                <strong className="text-gray-700">Current Role:</strong>{" "}
                <span
                  className={`${
                    isEditing ? "text-black" : "text-purple-600"
                  } font-medium`}
                >
                  {user.role}
                </span>
              </p>
              <p>
                <strong className="text-gray-700">Skills:</strong>{" "}
                <span
                  className={`${
                    isEditing ? "text-black" : "text-pink-600"
                  } font-medium`}
                >
                  {user.skills && user.skills.length > 0
                    ? user.skills.join(", ")
                    : "N/A"}
                </span>
              </p>

              {isEditing ? (
                <div className="mt-4 space-y-3">
                  <select
                    className="select select-bordered w-full bg-white text-black focus:ring-2 focus:ring-purple-500"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Comma-separated skills"
                    className="input input-bordered w-full bg-white text-black focus:ring-2 focus:ring-pink-500"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                  />

                  <div className="flex gap-3">
                    <button
                      className="btn bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white btn-sm hover:opacity-90"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn bg-indigo-500 text-white btn-sm mt-3 hover:bg-indigo-400"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
