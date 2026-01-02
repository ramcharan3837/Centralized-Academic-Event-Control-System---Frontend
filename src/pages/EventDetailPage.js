// src/pages/EventDetailPage.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Sample events data (replace with API or shared state if needed)
const sampleEvents = [
  { 
    id: 1, 
    name: "React Workshop", 
    about: "Deep dive into React basics and hooks, projects, and best practices.", 
    purpose: "Skill development for frontend development", 
    organizer: "John Doe", 
    venue: "Hall A", 
    totalParticipants: 10, 
    date: "2025-09-10",
    image: "/assets/react.jpg"
  },
  { 
    id: 2, 
    name: "AI Seminar", 
    about: "Introduction to AI concepts and applications.", 
    purpose: "Expose students to AI and ML fundamentals", 
    organizer: "AI Club", 
    venue: "Hall B", 
    totalParticipants: 5,
    date: "2025-09-15",
    image: "/assets/ai.jpg"
  },
  { 
    id: 3, 
    name: "Web Dev Meetup", 
    about: "Networking and collaborative projects.", 
    purpose: "Team building and project showcase", 
    organizer: "Web Club", 
    venue: "Hall C", 
    totalParticipants: 8,
    date: "2025-09-20",
    image: "/assets/web.jpg"
  },
];

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event] = useState(sampleEvents.find(ev => ev.id === parseInt(id)));

  if (!event) return <p className="p-8 text-gray-700">Event not found.</p>;

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-auto p-8 flex justify-center items-start z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Event Image */}
        <img src={event.image} alt={event.name} className="w-full h-80 object-cover rounded-2xl mb-6" />

        {/* Event Details */}
        <h2 className="text-4xl font-bold mb-4 text-gray-800">{event.name}</h2>
        <p className="text-gray-700 mb-4 text-lg">{event.about}</p>

        <div className="space-y-3 text-gray-700 text-lg">
          <p><span className="font-semibold">Purpose:</span> {event.purpose}</p>
          <p><span className="font-semibold">Organizer:</span> {event.organizer}</p>
          <p><span className="font-semibold">Venue:</span> {event.venue}</p>
          <p><span className="font-semibold">Date:</span> {event.date}</p>
          <p><span className="font-semibold">Total Participants:</span> {event.totalParticipants}</p>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition text-lg"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
