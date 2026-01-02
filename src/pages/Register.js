import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../components/baseUrl";

function Register() {
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const newUser = { fullName, rollNumber, branch, role, email, password };
    try {
      const res = await axios.post(`${base_url}register`, newUser);
      alert(res?.data?.message);
      setFullName("");
      setRollNumber("");
      setBranch("");
      setRole("user");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full animate-pulse"></div>

      {/* Registration Card */}
      <div className="relative bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-3xl p-12 w-full max-w-lg hover:scale-105 transition-transform duration-500">
        <h2 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl">👤</span>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg"
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl">🎓</span>
            <input
              type="text"
              placeholder="Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg"
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl">🏫</span>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg"
              required
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="CIVIL">CIVIL</option>
              <option value="MECHANICAL">MECHANICAL</option>
              <option value="MCA">MCA</option>
            </select>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl">🛡️</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-lg"
              required
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

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

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-bold text-lg text-white shadow-lg transition-all"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300 text-lg">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
