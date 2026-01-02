// src/pages/EventDetail.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const events = [
  { id: 1, name: "React Workshop", about: "Deep dive into React basics and hooks.", venue: "Hall 1", strength: 10 },
  { id: 2, name: "AI Seminar", about: "Learn about AI concepts and applications.", venue: "Hall 2", strength: 5 }
];

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(events.find(ev => ev.id === parseInt(id)));

  const handleRegister = () => {
    if (event.strength > 0) {
      setEvent({ ...event, strength: event.strength - 1 });
      alert("You are successfully registered!");
    }
  };

  if (!event) return <p>Event not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">{event.name}</h2>
        <p className="text-gray-700 mb-4">{event.about}</p>
        <p className="mb-2"><strong>Venue:</strong> {event.venue}</p>
        <p className="mb-4"><strong>Seats Left:</strong> {event.strength > 0 ? event.strength : "Registration Closed"}</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Back
          </button>
          <button
            onClick={handleRegister}
            disabled={event.strength <= 0}
            className={`px-4 py-2 rounded-lg ${
              event.strength > 0 ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
            } transition`}
          >
            {event.strength > 0 ? "Register" : "Closed"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
