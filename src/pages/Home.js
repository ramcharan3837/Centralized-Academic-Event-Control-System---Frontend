import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import axios from "axios";
import { base_url } from "../components/baseUrl";


function Home() {
  const [events,setEvents] = useState([])
  useEffect(()=>{
    getAllEvents()
  },[])
  const getAllEvents = () =>{
    axios.get(base_url+"events")
    .then((res)=>{
      
        const allEvents = res.data.events;

        const today = new Date();
        const upcoming = allEvents.filter((event) => new Date(event.date) >= today);
        setEvents(upcoming)

    })
    .catch((err)=>{
      console.log(err)
    })
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar onSearch={setSearchQuery} />
      <Hero />

      <section className="px-8 py-12">
        <h2 className="text-3xl font-bold mb-8 text-blue-400">Promoted Events</h2>
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-gray-800/80 backdrop-blur-md border border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all"
              >
                <img
                  src={"https://d2lk14jtvqry1q.cloudfront.net/media/large_264_c082f43202_365ae078c9.png"}
                  alt={event.name}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg font-semibold text-white mb-2">{event.name}</h3>
                <p className="text-gray-400 text-sm mb-1">📅 {event.date}</p>
                <p className="text-gray-400 text-sm mb-1">📍 {event.venue}</p>
                <p className="text-gray-400 text-sm mb-4">{event.shortDesc}</p>
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No events found.</p>
        )}
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

// Event Modal Component
function EventModal({ event, onClose }) {
  const handleRegister = () => {
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-2xl max-w-lg w-full space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl font-bold hover:text-red-500"
        >
          &times;
        </button>
        <img
          src={"https://d2lk14jtvqry1q.cloudfront.net/media/large_264_c082f43202_365ae078c9.png"}
          alt={event.title}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
        <h3 className="text-2xl font-bold text-blue-400">{event.name}</h3>
        <p className="text-gray-400">📅 {event.date}</p>
        <p className="text-gray-400">📍 {event.venue}</p>
        <p className="text-gray-400 mt-2">{event.shortDesc}</p>
        <p className="text-gray-400 mt-2">{event.about}</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleRegister}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition"
          >
            Register
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
