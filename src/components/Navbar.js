import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query); // send search term to Home.js
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        EventHub
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Search events..."
          className="px-2 py-1 rounded text-black"
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
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-green-600 px-3 py-1 rounded"
        >
          Create Event
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 px-3 py-1 rounded"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="bg-purple-600 px-3 py-1 rounded"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
