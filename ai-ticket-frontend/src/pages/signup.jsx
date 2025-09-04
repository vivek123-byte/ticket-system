import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-400 via-teal-500 to-blue-500">
      {/* ✅ Navbar remains outside (not removed) */}

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="card w-full max-w-md shadow-2xl bg-white rounded-2xl">
          <form onSubmit={handleSignup} className="card-body space-y-4">
            <h2 className="text-3xl font-extrabold text-center text-teal-600">
              Create Account ✨
            </h2>
            <p className="text-center text-gray-500 text-sm">
              Join <span className="font-semibold">Ticket AI</span> today!
            </p>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full focus:ring-2 focus:ring-teal-400"
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
                placeholder="Create a password"
                className="input input-bordered w-full focus:ring-2 focus:ring-teal-400"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn bg-teal-600 hover:bg-teal-700 text-white w-full"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
