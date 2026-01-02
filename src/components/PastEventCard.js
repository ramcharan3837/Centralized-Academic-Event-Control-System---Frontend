// src/components/PastEventCard.js
import React from "react";

function PastEventCard({ event }) {
  return (
    <div className="bg-gray-100 rounded-xl shadow-sm overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img src={event.image} alt={event.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
        <p className="text-gray-500 text-sm">{event.date}</p>
      </div>
    </div>
  );
}

export default PastEventCard;
