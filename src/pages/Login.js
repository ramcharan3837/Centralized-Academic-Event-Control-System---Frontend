import { useState, useEffect } from "react"; // ADD useEffect
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../components/baseUrl";
import { Link } from "react-router-dom";
import ModalPopup from "./ModalPopup";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [buttons, setButtons] = useState([]);
  
  // NEW: Auto-close modal and navigate after 2 seconds
useEffect(() => {
  if (showPopup && type === "success") {
    const timer = setTimeout(() => {
      setShowPopup(false);
      
      // FIX: Get role from stored user OR fallback
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userRole = storedUser.role || "user";
        
        if (userRole === "admin") navigate("/admin-dashboard");
        else if (userRole === "organizer") navigate("/organizer-dashboard");
        else navigate("/user-dashboard");
      } catch (e) {
        console.error("Navigation error:", e);
        navigate("/user-dashboard"); // Safe fallback
      }
    }, 800);

    return () => clearTimeout(timer);
  }
}, [showPopup, type, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${base_url}login`, { email, password, role });

      if (res.data.status === "Success") {
        // Store token/user FIRST
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Show success modal
        setType("success");
        setMessage(res.data.message || "Login successful!");
        setButtons([
          {
            text: 'Close',
            action: () => {
              setShowPopup(false);
            }
          }
        ]);
        setShowPopup(true);

        // REMOVED: Navigation moved to useEffect
      } else {
        setType("error");
        setMessage(res.data.message || "Login failed");
        setButtons([
          { text: 'OK', action: () => setShowPopup(false) }
        ]);
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setType("error");
      setMessage("Server error — check backend connection");
      setButtons([
        { text: 'Retry', action: () => setShowPopup(false) }
      ]);
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated background circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full animate-pulse"></div>

      {/* Login Card */}
      {!showForgotPassword ? (
        <div className="relative bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-12 w-full max-w-lg hover:scale-105 transition-transform duration-500">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
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
                className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
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
                className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
                required
              />
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
              required
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-bold text-base sm:text-lg text-white shadow-lg transition-all"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold text-sm sm:text-base hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <p className="mt-6 text-center text-gray-300 text-base sm:text-lg">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      ) : (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
      
      <ModalPopup 
        showPopup={showPopup}
        type={type}
        message={message}
        buttons={buttons}
      />
    </div>
  );
}

// Forgot Password Modal Component
function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${base_url}forgot-password/send-otp`, { email });
      
      if (res.data.status === "Success") {
        setMessage("✅ OTP sent to your email!");
        setStep(2);
      } else {
        setMessage("❌ " + (res.data.message || "Failed to send OTP"));
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setMessage("❌ " + (err.response?.data?.message || "Failed to send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${base_url}forgot-password/verify-otp`, { email, otp });
      
      if (res.data.status === "Success") {
        setMessage("✅ OTP verified! Set your new password.");
        setStep(3);
      } else {
        setMessage("❌ " + (res.data.message || "Invalid OTP"));
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setMessage("❌ " + (err.response?.data?.message || "Invalid or expired OTP"));
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${base_url}forgot-password/reset-password`, {
        email,
        otp,
        newPassword,
      });
      
      if (res.data.status === "Success") {
        setMessage("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage("❌ " + (res.data.message || "Failed to reset password"));
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setMessage("❌ " + (err.response?.data?.message || "Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-12 w-full max-w-lg">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
      >
        ✕
      </button>

      <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Reset Password
      </h2>
      <p className="text-gray-400 text-center mb-6 text-sm sm:text-base">
        {step === 1 && "Enter your email to receive OTP"}
        {step === 2 && "Enter the OTP sent to your email"}
        {step === 3 && "Create your new password"}
      </p>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500' : 'bg-gray-600'}`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500' : 'bg-gray-600'}`}>
            2
          </div>
          <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-500' : 'bg-gray-600'}`}>
            3
          </div>
        </div>
      </div>

      {/* Step 1: Email Input */}
      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl">📧</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-bold text-base sm:text-lg text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* Step 2: OTP Input */}
      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl">🔑</span>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg text-center tracking-widest"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-bold text-base sm:text-lg text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setOtp("");
              setMessage("");
            }}
            className="w-full text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Back to email
          </button>
        </form>
      )}

      {/* Step 3: New Password Input */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl">🔒</span>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
              required
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl">🔒</span>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 rounded-2xl font-bold text-base sm:text-lg text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-4 rounded-xl text-center text-sm sm:text-base ${
          message.startsWith("✅") 
            ? "bg-green-900/50 text-green-300 border border-green-700" 
            : "bg-red-900/50 text-red-300 border border-red-700"
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full mt-6 text-gray-400 hover:text-white text-sm"
      >
        ← Back to Login
      </button>
    </div>
  );
}

export default Login;