// src/components/EventCard.js
import { useState } from "react";

function EventCard({ image, title, date, description, venue, onRegister }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="rounded-xl shadow-lg overflow-hidden bg-white">
      {/* Event Image */}
      <img src={image} alt={title} className="w-full h-40 object-cover" />

      {/* Event Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{date}</p>

        {/* Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {showDetails ? "Hide" : "View"}
          </button>
          <button
            onClick={onRegister}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Register
          </button>
        </div>

        {/* Toggle Details */}
        {showDetails && (
          <div className="mt-4 text-sm text-gray-700 space-y-2 border-t pt-3">
            <p><span className="font-semibold">📍 Venue:</span> {venue}</p>
            <p><span className="font-semibold">ℹ️ About:</span> {description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
