// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default landing page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />          {/* Default user dashboard */}
        <Route path="/user-dashboard" element={<UserDashboard />} /> {/* Student/User dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
