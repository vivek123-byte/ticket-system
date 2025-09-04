import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform"
            >
              🎟️ Ticket AI
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <Link
                  to="/signup"
                  className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-medium shadow-md hover:bg-yellow-300 hover:shadow-lg transition"
                >
                  Signup
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-medium shadow-md hover:bg-gray-200 hover:shadow-lg transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm font-medium">
                  👋 Hi,{" "}
                  <span className="font-semibold text-yellow-300">
                    {user?.email}
                  </span>
                </span>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="bg-pink-500 px-4 py-2 rounded-xl shadow-md font-medium hover:bg-pink-400 hover:shadow-lg transition"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-red-500 px-4 py-2 rounded-xl shadow-md font-medium hover:bg-red-400 hover:shadow-lg transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
