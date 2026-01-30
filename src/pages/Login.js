import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../components/baseUrl";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${base_url}login`, { email, password, role });

      if (res.data.status === "Success") {
        alert(res.data.message);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (res.data.user.role === "admin") navigate("/admin-dashboard");
        else if (res.data.user.role === "organizer") navigate("/organizer-dashboard");
        else navigate("/user-dashboard");
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error — please check backend connection");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full animate-pulse"></div>

      {/* Login Card */}
      <div className="relative bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-3xl p-12 w-full max-w-lg hover:scale-105 transition-transform duration-500">
        <h2 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl">📧</span>
            <input
              type="email"
              placeholder="College Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg"
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg"
              required
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg"
            required
          >
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-bold text-lg text-white shadow-lg transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300 text-lg">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
  Register
</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
