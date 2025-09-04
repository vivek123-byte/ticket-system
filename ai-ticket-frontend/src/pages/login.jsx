import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* ✅ Navbar stays above, not removed */}

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="card w-full max-w-md shadow-2xl bg-white rounded-2xl">
          <form onSubmit={handleLogin} className="card-body space-y-4">
            <h2 className="text-3xl font-extrabold text-center text-indigo-600">
              Welcome Back 👋
            </h2>
            <p className="text-center text-gray-500 text-sm">
              Sign in to continue to{" "}
              <span className="font-semibold">Ticket AI</span>
            </p>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full bg-white text-black placeholder-gray-400 focus:bg-white focus:text-black focus:ring-2 focus:ring-teal-400 focus:outline-none"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full bg-white text-black placeholder-gray-400 focus:bg-white focus:text-black focus:ring-2 focus:ring-teal-400 focus:outline-none"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-2">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-indigo-600 hover:underline">
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
