import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardEventCard({ event }) {
  const navigate = useNavigate();
  const [seatsLeft, setSeatsLeft] = useState(event.strength);

  const handleView = () => {
    navigate(`/event/${event.id}`);
  };

  const handleRegister = () => {
    if (seatsLeft > 0) {
      setSeatsLeft(seatsLeft - 1);
      alert("You have successfully registered!");
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden transition-transform transform hover:scale-105 duration-300">
      <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800">{event.name}</h3>
        <p className="text-gray-600 mt-2">{event.shortDesc}</p>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-gray-700"><span className="font-semibold">📍 Venue:</span> {event.venue}</p>
            <p className="text-gray-700"><span className="font-semibold">Seats Left:</span> {seatsLeft > 0 ? seatsLeft : "Closed"}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleView}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View
            </button>
            <button
              onClick={handleRegister}
              disabled={seatsLeft <= 0}
              className={`px-4 py-2 rounded-lg ${seatsLeft > 0 ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"} transition`}
            >
              {seatsLeft > 0 ? "Register" : "Closed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEventCard;
