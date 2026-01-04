import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../components/baseUrl";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";

const BRANCH_OPTIONS = ["CSE", "ECE", "CIVIL", "MECHANICAL", "MCA"];
const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "organizer", label: "Organizer" },
];

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
    if (!branch) {
      alert("Please select a branch");
      return;
    }
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

  const currentRoleObj =
    ROLE_OPTIONS.find((r) => r.value === role) || ROLE_OPTIONS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden px-4 sm:px-6">
      {/* Animated background circles */}
      <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 sm:w-96 sm:h-96 bg-purple-600/20 rounded-full animate-pulse" />

      {/* Registration Card */}
      <div className="relative bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl w-full max-w-md sm:max-w-lg p-6 sm:p-8 md:p-12 transition-transform duration-500 hover:scale-105">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
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
                  <span className="block truncate">
                    {branch || "Select Branch"}
                  </span>
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
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
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
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
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
            <Listbox
              value={currentRoleObj}
              onChange={(val) => setRole(val.value)}
            >
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
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 sm:pl-12 py-3 sm:p-4 rounded-2xl bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-base sm:text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 rounded-2xl font-bold text-base sm:text-lg text-white shadow-lg transition-all"
          >
            Register
          </button>
        </form>

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
      </div>
    </div>
  );
}

export default Register;
