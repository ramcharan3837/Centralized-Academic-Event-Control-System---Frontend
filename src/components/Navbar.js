import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setIsOpen(false); // close menu on search (mobile)
  };

  return (
    <nav className="bg-gray-900 text-white">
      {/* Wrapper */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            EventHub
          </h1>

          {/* Desktop search + buttons */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Search Bar */}
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                placeholder="Search events..."
                className="px-2 py-1 rounded text-black w-40 lg:w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="ml-2 bg-blue-600 px-3 py-1 rounded"
              >
                Search
              </button>
            </form>

            {/* Navigation Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="bg-green-600 px-3 py-1 rounded text-sm"
              >
                Create Event
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 px-3 py-1 rounded text-sm"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-purple-600 px-3 py-1 rounded text-sm"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-gray-800 focus:outline-none"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="sr-only">Open main menu</span>
            {/* Icon */}
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-800">
          <div className="px-4 pt-3 pb-4 space-y-3">
            {/* Search Bar */}
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                placeholder="Search events..."
                className="flex-1 px-2 py-1 rounded text-black"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="ml-2 bg-blue-600 px-3 py-1 rounded text-sm"
              >
                Search
              </button>
            </form>

            {/* Navigation Buttons */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
                className="bg-green-600 px-3 py-2 rounded text-left"
              >
                Create Event
              </button>
              <button
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
                className="bg-blue-600 px-3 py-2 rounded text-left"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setIsOpen(false);
                }}
                className="bg-purple-600 px-3 py-2 rounded text-left"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
