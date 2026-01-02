import axios from "axios";
import { useEffect, useState } from "react";
import { base_url } from "../components/baseUrl";

// Compact Event Calendar Component
function CompactEventCalendar({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const eventDates = events.map(event => {
    // Extract just the date part without timezone conversion
    const dateOnly = event.date.split('T')[0];
    return dateOnly;
  });

  const getEventsForDate = (dateStr) => {
    return events.filter(event => {
      const eventDateOnly = event.date.split('T')[0];
      return eventDateOnly === dateStr;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
    setShowEventDetails(false);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
    setShowEventDetails(false);
  };

  const handleDateClick = (day) => {
    // Create date string in YYYY-MM-DD format
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    setSelectedDate(dateStr);
    setShowEventDetails(true);
  };

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    // Create date string in YYYY-MM-DD format for comparison
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    
    const hasEvent = eventDates.includes(dateStr);
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;
    const isSelected = selectedDate === dateStr;

    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`aspect-square p-1 rounded text-xs font-medium transition-all relative flex items-center justify-center
          ${isToday ? 'ring-1 ring-blue-400' : ''}
          ${isSelected ? 'bg-blue-600 text-white' : ''}
          ${hasEvent && !isSelected ? 'bg-green-500 text-white font-bold' : ''}
          ${!hasEvent && !isSelected ? 'text-gray-400 hover:bg-gray-700/30' : ''}`}
      >
        {day}
      </button>
    );
  }

  const selectedDayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="bg-gray-800/90 border border-gray-700 rounded-xl shadow-lg p-3 w-64">
      <div className="flex items-center justify-between mb-3">
        <button onClick={previousMonth} className="p-1 hover:bg-gray-700/50 rounded transition">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" strokeWidth="2"/>
          </svg>
        </button>
        <h4 className="text-sm font-semibold text-white">{monthNames[month]} {year}</h4>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-700/50 rounded transition">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3">{calendarDays}</div>

      <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-700/50 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-gray-400">Event</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded ring-1 ring-blue-400" />
          <span className="text-gray-400">Today</span>
        </div>
      </div>

      {showEventDetails && selectedDate && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-xs font-semibold text-gray-300">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </h5>
            <button onClick={() => setShowEventDetails(false)} className="text-gray-500 hover:text-gray-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {selectedDayEvents.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No events</p>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedDayEvents.map((event) => (
                <div key={event._id} className="bg-gray-700/40 p-2 rounded text-xs">
                  <p className="text-white font-medium truncate">{event.name}</p>
                  <p className="text-gray-400 truncate">📍 {event.venue}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UserDashboard() {
  const [eventsData, setEventsData] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [recentlyRegistered, setRecentlyRegistered] = useState(null);
  const [viewStates, setViewStates] = useState({});
  const [showEventForm, setShowEventForm] = useState(false);

  // Event form states
  const [editEvent, setEditEvent] = useState(null);
  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [strength, setStrength] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [about, setAbout] = useState("");
  const [learning, setLearning] = useState("");

  useEffect(() => {
    getAllEvents();
  }, []);

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!name || !eventDate || !venue || !strength || !shortDesc || !about || !learning) {
      alert("Please fill all fields");
      return;
    }

    const eventData = {
      name,
      date: eventDate,
      venue,
      strength: parseInt(strength),
      shortDesc,
      about,
      learning
    };

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    if (editEvent) {
      axios
        .put(base_url + `events/${editEvent._id}`, eventData, config)
        .then(() => {
          alert("Event updated and submitted for re-approval!");
          resetForm();
          getAllEvents();
        })
        .catch((err) => {
          console.log(err);
          alert(err.response?.data?.message || "Failed to update event");
        });
    } else {
      axios
        .post(base_url + "events", eventData, config)
        .then(() => {
          alert("Event submitted for admin approval!");
          resetForm();
          getAllEvents();
        })
        .catch((err) => {
          console.log(err);
          alert(err.response?.data?.message || "Failed to create event");
        });
    }
  };

  const resetForm = () => {
    setEditEvent(null);
    setName("");
    setEventDate("");
    setVenue("");
    setStrength("");
    setShortDesc("");
    setAbout("");
    setLearning("");
    setShowEventForm(false);
  };

  const handleEditClick = (event) => {
    setEditEvent(event);
    setName(event.name);
    setEventDate(event.date);
    setVenue(event.venue);
    setStrength(event.strength);
    setShortDesc(event.shortDesc);
    setAbout(event.about);
    setLearning(event.learning);
    setShowEventForm(true);
  };

  const getAllEvents = () => {
    axios
      .get(base_url + "events")
      .then((res) => {
        const allEvents = res?.data?.events;
        setEventsData(allEvents);

        const today = new Date();
        const upcoming = allEvents.filter((event) => new Date(event.date) >= today);
        const past = allEvents.filter((event) => new Date(event.date) < today);

        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        past.sort((a, b) => new Date(b.date) - new Date(a.date));

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleRegister = (event) => {
    if (!registeredEvents.find((e) => e._id === event._id)) {
      setRegisteredEvents([...registeredEvents, event]);
      setRecentlyRegistered(event);
    } else {
      setRecentlyRegistered({ ...event, already: true });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  // Filter events by selected date
  const filteredUpcomingEvents = date
    ? upcomingEvents.filter((event) => event.date === date)
    : upcomingEvents;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Compact Calendar - Fixed Position Top Right */}
      <div className="fixed top-20 right-6 z-40">
        <CompactEventCalendar events={eventsData} />
      </div>

      {/* Navbar */}
      <nav className="bg-gray-950 bg-opacity-80 backdrop-blur-md text-white px-8 py-4 flex justify-between items-center shadow-lg border-b border-gray-700">
        <h1 className="text-2xl font-bold text-blue-400">Event Coordination Engine</h1>
        <div className="flex space-x-8 text-lg">
          <a href="/home" className="hover:text-blue-300 transition">Home</a>
          <a href="#browse" className="hover:text-blue-300 transition">Browse Events</a>
          <a href="#registered" className="hover:text-blue-300 transition">My Events</a>
          <button 
            onClick={() => setShowEventForm(!showEventForm)}
            className="hover:text-green-300 transition"
          >
            {showEventForm ? "Hide Form" : "Create Event"}
          </button>
          <button onClick={handleLogout} className="hover:text-blue-400 transition">Logout</button>
        </div>
      </nav>

      {/* Recently Registered Notification */}
      {recentlyRegistered && (
        <div className={`bg-gray-800/90 border ${recentlyRegistered.already ? "border-yellow-500" : "border-green-500"} p-6 rounded-2xl shadow-lg mx-10 my-4`}>
          <p className={`text-lg font-semibold mb-2 ${recentlyRegistered.already ? "text-yellow-400" : "text-green-400"}`}>
            {recentlyRegistered.already
              ? `⚠️ You already registered for ${recentlyRegistered.name}`
              : `✅ Successfully registered for ${recentlyRegistered.name}`}
          </p>
          <button
            onClick={() => setRecentlyRegistered(null)}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition"
          >
            Close
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center py-12">
        <h2 className="text-4xl font-bold text-blue-400 tracking-wide">
          Welcome, <span className="text-white">User</span>
        </h2>
        <p className="text-gray-400 mt-3 text-lg">
          Discover and register for exciting upcoming events
        </p>
        <button
          onClick={() =>
            document.getElementById("browse").scrollIntoView({ behavior: "smooth" })
          }
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
        >
          Browse Events
        </button>
      </section>

      {/* Event Creation/Edit Form */}
      {showEventForm && (
        <div className="mx-10 mb-6 bg-gray-800/80 border border-gray-700 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-blue-400">
              {editEvent ? "Edit Event" : "Create Event"}
            </h3>
            <button
              onClick={resetForm}
              className="text-red-400 hover:text-red-500 text-2xl"
            >
              ✕
            </button>
          </div>
          <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg mb-4">
            <p className="text-blue-300 text-sm">
              ℹ️ Your event will be submitted for admin approval before it appears publicly
            </p>
          </div>
          <form onSubmit={handleSaveEvent} className="space-y-4">
            <input 
              type="text" 
              placeholder="Event Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none" 
            />
            <input 
              type="date" 
              value={eventDate} 
              onChange={e => setEventDate(e.target.value)} 
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none" 
            />
            <input 
              type="text" 
              placeholder="Venue" 
              value={venue} 
              onChange={e => setVenue(e.target.value)} 
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none" 
            />
            <input 
              type="number" 
              placeholder="Expected Participants" 
              value={strength} 
              onChange={e => setStrength(e.target.value)} 
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none" 
            />
            <textarea 
              placeholder="Short Description" 
              value={shortDesc} 
              onChange={e => setShortDesc(e.target.value)} 
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-20 resize-none focus:border-blue-500 focus:outline-none" 
            />
            <textarea 
              placeholder="About Event" 
              value={about} 
              onChange={e => setAbout(e.target.value)} 
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-24 resize-none focus:border-blue-500 focus:outline-none" 
            />
            <textarea 
              placeholder="Learning Outcomes" 
              value={learning} 
              onChange={e => setLearning(e.target.value)} 
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-24 resize-none focus:border-blue-500 focus:outline-none" 
            />
            <div className="flex justify-end gap-4 mt-2">
              <button 
                type="button" 
                onClick={resetForm} 
                className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded transition"
              >
                {editEvent ? "Update Event" : "Submit Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="px-10 pb-12">
        <div className="flex flex-col md:flex-row gap-10 relative">
          {/* Browse by Date (Rightmost corner) */}
          <div className="absolute right-0 top-0 md:top-[-50px] flex flex-col items-end">
            <label className="text-blue-400 text-sm mb-1 font-semibold">
              📅 Browse by Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {date && (
              <button
                onClick={() => setDate("")}
                className="text-red-400 text-xs mt-2 underline hover:text-red-500"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="flex-1">
            {/* Upcoming Events */}
            <section id="browse" className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-blue-400">Upcoming Events</h3>
              {filteredUpcomingEvents.length === 0 ? (
                <p className="text-gray-400">No upcoming events for this date.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredUpcomingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-gray-800/80 border border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-blue-400/20 transition-all"
                    >
                      <h4 className="text-lg font-semibold text-white mb-2">{event.name}</h4>
                      <p className="text-gray-400 text-sm mb-1">📅 {event.date}</p>
                      <p className="text-gray-400 text-sm mb-1">📍 {event.venue}</p>
                      <p className="text-gray-400 text-sm mb-1">📝 {event.shortDesc}</p>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleRegister(event)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                        >
                          Register
                        </button>
                        <button
                          onClick={() =>
                            setViewStates((prev) => ({ ...prev, [event._id]: !prev[event._id] }))
                          }
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
                        >
                          {viewStates[event._id] ? "Hide Details" : "View"}
                        </button>
                      </div>

                      {viewStates[event._id] && (
                        <div className="mt-4 bg-gray-700/50 p-3 rounded-lg text-gray-300 text-sm space-y-2">
                          <p><strong>About Event:</strong> {event.about}</p>
                          <p><strong>Learning Outcomes:</strong> {event.learning}</p>
                          <p><strong>Full Description:</strong> {event.shortDesc}</p>
                          <p><strong>Strength:</strong> {event.strength}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past Events */}
            <section id="past-events" className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-blue-400">Past Events</h3>
              {pastEvents.length === 0 ? (
                <p className="text-gray-400">No past events yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-gray-800/80 border border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-gray-500/30 transition-all"
                    >
                      <h4 className="text-lg font-semibold text-white mb-2">{event.name}</h4>
                      <p className="text-gray-400 text-sm mb-1">📅 {event.date}</p>
                      <p className="text-gray-400 text-sm mb-1">📍 {event.venue}</p>
                      <p className="text-gray-400 text-sm mb-1">👥 Strength: {event.strength}</p>
                      <p className="text-gray-400 text-sm mb-1">📝 {event.shortDesc}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;