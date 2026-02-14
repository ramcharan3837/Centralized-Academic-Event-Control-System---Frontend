// ========================================
// Register.js - FULLY UPDATED WITH OTP & PASSWORD VALIDATION
// Replace your existing Register.js with this complete file
// ========================================

import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../components/baseUrl";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";



const BRANCH_OPTIONS = ["CSE", "ECE", "CIVIL", "MECHANICAL", "MCA","EEE","IT","DS","AIML"];
const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "organizer", label: "Organizer" },
];

function Register() {
  const navigate = useNavigate();

  // Step Control (1 = Registration Form, 2 = OTP Verification)
  const [step, setStep] = useState(1);

  // Form Data
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP Data
  const [otp, setOtp] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Validation States
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Timer for OTP expiry
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [timerActive, setTimerActive] = useState(false);

  // Validate password strength in real-time
  const validatePasswordStrength = (pwd) => {
    setPasswordStrength({
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    validatePasswordStrength(pwd);
  };

  // Check if password is strong enough
  const isPasswordStrong = () => {
    return (
      passwordStrength.minLength &&
      passwordStrength.hasUpperCase &&
      passwordStrength.hasLowerCase &&
      passwordStrength.hasNumber &&
      passwordStrength.hasSpecialChar
    );
  };

  // Start countdown timer
  const startTimer = () => {
    setTimeLeft(600);
    setTimerActive(true);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // STEP 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validation
    if (!branch) {
      setError("Please select a branch");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isPasswordStrong()) {
      setError("Please ensure your password meets all requirements");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${base_url}register`, {
        fullName,
        rollNumber,
        branch,
        role,
        email,
        password,
        step: "request-otp",
      });

      if (response.data.status === "Success") {
        setStep(2);
        setSuccessMessage(response.data.message);
        startTimer();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${base_url}register`, {
        email,
        otp,
        step: "verify-otp",
      });

      if (response.data.status === "Success") {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${base_url}register`, {
        email,
        step: "resend-otp",
      });

      if (response.data.status === "Success") {
        setSuccessMessage("New OTP sent to your email!");
        setOtp("");
        startTimer();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentRoleObj = ROLE_OPTIONS.find((r) => r.value === role) || ROLE_OPTIONS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden px-4 sm:px-6">
      {/* Animated background circles */}
      <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 sm:w-96 sm:h-96 bg-purple-600/20 rounded-full animate-pulse" />

      {/* Registration Card */}
      <div className="relative bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-lg p-6 sm:p-8 md:p-12 transition-transform duration-500 hover:scale-105">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {step === 1 ? "Create Account" : "Verify Email"}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-4 sm:space-y-6">
            {/* Full Name */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-lg sm:text-xl">
                👤
              </span>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 sm:pl-12 py-3 sm:p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
                required
              />
            </div>

            {/* Roll Number */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-lg sm:text-xl">
                🎓
              </span>
              <input
                type="text"
                placeholder="Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full pl-11 sm:pl-12 py-3 sm:p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
                required
              />
            </div>

            {/* Branch dropdown */}
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-lg sm:text-xl">
                🏫
              </span>
              <Listbox value={branch} onChange={setBranch}>
                <div className="relative w-full">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-gray-900 border border-gray-700 py-3 sm:py-4 pl-11 sm:pl-12 pr-10 text-left text-base sm:text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span className="block truncate">{branch || "Select Branch"}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-gray-900 py-1 text-sm sm:text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <Listbox.Option
                        value=""
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-4 pr-10 ${
                            active ? "bg-blue-600 text-white" : "text-gray-200"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                              🏫 Select Branch
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 right-3 flex items-center text-blue-300">
                                <CheckIcon className="h-4 w-4" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                      {BRANCH_OPTIONS.map((b) => (
                        <Listbox.Option
                          key={b}
                          value={b}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-4 pr-10 ${
                              active ? "bg-blue-600 text-white" : "text-gray-200"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                {b}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-3 flex items-center text-blue-300">
                                  <CheckIcon className="h-4 w-4" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Role dropdown */}
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-lg sm:text-xl">
                🛡️
              </span>
              <Listbox value={currentRoleObj} onChange={(val) => setRole(val.value)}>
                <div className="relative w-full">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-gray-900 border border-gray-700 py-3 sm:py-4 pl-11 sm:pl-12 pr-10 text-left text-base sm:text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span className="block truncate">{currentRoleObj.label}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-gray-900 py-1 text-sm sm:text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {ROLE_OPTIONS.map((r) => (
                        <Listbox.Option
                          key={r.value}
                          value={r}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-4 pr-10 ${
                              active ? "bg-blue-600 text-white" : "text-gray-200"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                {r.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-3 flex items-center text-blue-300">
                                  <CheckIcon className="h-4 w-4" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-lg sm:text-xl">
                📧
              </span>
              <input
                type="email"
                placeholder="College Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 sm:pl-12 py-3 sm:p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-lg sm:text-xl">
                🔒
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordFocused(true)}
                className="w-full pl-11 sm:pl-12 pr-12 py-3 sm:p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwordFocused && password && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-xs">
                <p className="text-gray-300 font-semibold mb-2">Password must contain:</p>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 ${passwordStrength.minLength ? "text-green-400" : "text-gray-500"}`}>
                    <span>{passwordStrength.minLength ? "✓" : "○"}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasUpperCase ? "text-green-400" : "text-gray-500"}`}>
                    <span>{passwordStrength.hasUpperCase ? "✓" : "○"}</span>
                    <span>One uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasLowerCase ? "text-green-400" : "text-gray-500"}`}>
                    <span>{passwordStrength.hasLowerCase ? "✓" : "○"}</span>
                    <span>One lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? "text-green-400" : "text-gray-500"}`}>
                    <span>{passwordStrength.hasNumber ? "✓" : "○"}</span>
                    <span>One number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasSpecialChar ? "text-green-400" : "text-gray-500"}`}>
                    <span>{passwordStrength.hasSpecialChar ? "✓" : "○"}</span>
                    <span>One special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-lg sm:text-xl">
                🔒
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 sm:pl-12 pr-12 py-3 sm:p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className={`text-xs ${password === confirmPassword ? "text-green-400" : "text-red-400"}`}>
                {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-bold text-base sm:text-lg text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending OTP..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Email Display */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">OTP sent to:</p>
              <p className="text-white font-medium break-all">{email}</p>
            </div>

            {/* OTP Input */}
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2 text-center">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                    setError("");
                  }}
                  className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              {/* Timer */}
              {timerActive && timeLeft > 0 && (
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Time remaining:{" "}
                    <span className="text-blue-400 font-mono font-bold">{formatTime(timeLeft)}</span>
                  </p>
                </div>
              )}

              {/* Expired Message */}
              {!timerActive && timeLeft === 0 && (
                <div className="text-center">
                  <p className="text-red-400 text-sm">OTP expired. Please request a new one.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !timerActive}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Register"}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="text-center space-y-2">
              <p className="text-gray-400 text-sm">Didn't receive the code?</p>
              <button
                onClick={handleResendOTP}
                disabled={loading || (timerActive && timeLeft > 540)}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Resend OTP"}
              </button>
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setTimerActive(false);
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition"
            >
              ← Back to Registration
            </button>
          </div>
        )}

        {/* Login Link */}
        {step === 1 && (
          <p className="mt-4 sm:mt-6 text-center text-gray-300 text-sm sm:text-lg">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-400 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;