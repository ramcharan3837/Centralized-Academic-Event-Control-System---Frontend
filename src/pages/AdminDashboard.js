import axios from "axios";
import { useEffect, useState } from "react";
import { base_url } from "../components/baseUrl";

// Event Calendar Component
function EventCalendar({ events = [], onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const eventDates = events.map(event => new Date(event.date).toISOString().split('T')[0]);

  const getEventsForDate = (dateStr) => {
    return events.filter(event => new Date(event.date).toISOString().split('T')[0] === dateStr);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    setSelectedDate(dateStr);
    if (onDateClick) onDateClick(dateStr);
  };

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    const hasEvent = eventDates.includes(dateStr);
    const isToday = new Date().toISOString().split('T')[0] === dateStr;
    const isSelected = selectedDate === dateStr;
    const dayEvents = getEventsForDate(dateStr);

    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`aspect-square p-2 rounded-lg text-sm font-medium transition-all hover:scale-105 hover:shadow-lg relative
          ${isToday ? 'ring-2 ring-blue-500' : ''}
          ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-800/50 text-gray-300'}
          ${hasEvent && !isSelected ? 'bg-green-600/30 border-2 border-green-500' : ''}
          ${!hasEvent && !isSelected ? 'hover:bg-gray-700/50' : ''}`}
      >
        <span className="relative z-10">{day}</span>
        {hasEvent && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {dayEvents.slice(0, 3).map((_, idx) => (
              <div key={idx} className="w-1 h-1 rounded-full bg-green-400" />
            ))}
          </div>
        )}
      </button>
    );
  }

  const selectedDayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2 rounded-lg">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Event Calendar</h3>
            <p className="text-xs text-gray-400">Click dates to view events</p>
          </div>
        </div>
        <button onClick={goToToday} className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium transition">
          Today
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button onClick={previousMonth} className="p-2 hover:bg-gray-700/50 rounded-lg transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" strokeWidth="2"/>
          </svg>
        </button>
        <h4 className="text-lg font-semibold text-white">{monthNames[month]} {year}</h4>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-700/50 rounded-lg transition">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">{calendarDays}</div>

      <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-700/50 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-600/30 border-2 border-green-500" />
          <span className="text-gray-400">Has Events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded ring-2 ring-blue-500" />
          <span className="text-gray-400">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <span className="text-gray-400">Selected</span>
        </div>
      </div>

      {selectedDate && (
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">
            Events on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h4>
          {selectedDayEvents.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No events scheduled</p>
          ) : (
            <div className="space-y-2">
              {selectedDayEvents.map((event) => (
                <div key={event._id} className="bg-gray-700/30 border border-green-500/30 p-3 rounded-lg hover:border-green-500/50 transition">
                  <p className="text-sm font-medium text-white mb-1">{event.name}</p>
                  <p className="text-xs text-gray-400">📍 {event.venue}</p>
                  {event.strength && <p className="text-xs text-gray-400 mt-1">👥 {event.strength} participants</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [viewStates, setViewStates] = useState({});
  const [activeTab, setActiveTab] = useState("create");
  const [editEvent, setEditEvent] = useState(null);
  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [strength, setStrength] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [about, setAbout] = useState("");
  const [learning, setLearning] = useState("");

  const [upcomingEvents , setUpcomingEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])

  useEffect(() => {
    getPendingEvents();
    getApprovedEvents();
    getAllEvents()
  }, []);

  const getAllEvents = () =>{
    axios.get(base_url+"/events")
    .then(()=>{
      const allEvents = res.data.events;
        setEventsData(allEvents);

        const today = new Date();
        const upcoming = allEvents.filter((event) => new Date(event.date) >= today);
        const past = allEvents.filter((event) => new Date(event.date) < today);

        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        past.sort((a, b) => new Date(b.date) - new Date(a.date));

        setUpcomingEvents(upcoming);
        setPastEvents(past);
    })
    .catch((err)=> console?.log(err))
  }

  const getPendingEvents = () => {
    const token = localStorage.getItem('token');
    axios.get(base_url + "events/pending", { headers: { 'Authorization': `Bearer ${token}` } })
      .then((res) => setPendingEvents(res?.data?.events || []))
      .catch((err) => {
        console.log(err.message);
        alert(err.response?.data?.message || "Failed to fetch pending events");
      });
  };

  const getApprovedEvents = () => {
    axios.get(base_url + "events")
      .then((res) => {
        setApprovedEvents(res?.data?.events || [])
        const allEvents = res.data.events;

        const today = new Date();
        const upcoming = allEvents.filter((event) => new Date(event.date) >= today);
        const past = allEvents.filter((event) => new Date(event.date) < today);

        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        past.sort((a, b) => new Date(b.date) - new Date(a.date));

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      })
      .catch((err) => console.log(err.message));
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!name || !eventDate || !venue || !strength || !shortDesc || !about || !learning) {
      alert("Please fill all fields");
      return;
    }

    const eventData = { name, date: eventDate, venue, strength: parseInt(strength), shortDesc, about, learning };
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    if (editEvent) {
      axios.put(base_url + `events/${editEvent._id}`, eventData, config)
        .then((res) => {
          alert(res.data.message || "Event updated successfully!");
          resetForm();
          getPendingEvents();
          getApprovedEvents();
        })
        .catch((err) => {
          console.log(err);
          alert(err.response?.data?.message || "Failed to update event");
        });
    } else {
      axios.post(base_url + "events", eventData, config)
        .then((res) => {
          alert(res.data.message || "Event created successfully!");
          resetForm();
          getPendingEvents();
          getApprovedEvents();
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
    setActiveTab("create");
  };

  const handleApprove = (eventId) => {
    const token = localStorage.getItem('token');
    if (window.confirm("Are you sure you want to approve this event?")) {
      axios.put(base_url + `events/${eventId}/approve`, {}, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(() => {
          alert("Event approved successfully!");
          getPendingEvents();
          getApprovedEvents();
        })
        .catch((err) => {
          console.log(err);
          alert(err.response?.data?.message || "Failed to approve event");
        });
    }
  };

  const handleReject = (eventId) => {
    const token = localStorage.getItem('token');
    if (window.confirm("Are you sure you want to reject and delete this event?")) {
      axios.delete(base_url + `events/${eventId}/reject`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(() => {
          alert("Event rejected successfully!");
          getPendingEvents();
        })
        .catch((err) => {
          console.log(err);
          alert(err.response?.data?.message || "Failed to reject event");
        });
    }
  };

  const handleDeleteApproved = (eventId) => {
    const token = localStorage.getItem('token');
    if (window.confirm("Are you sure you want to delete this approved event?")) {
      axios.delete(base_url + `events/${eventId}`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(() => {
          alert("Event deleted successfully!");
          getApprovedEvents();
        })
        .catch((err) => {
          console.log(err);
          alert(err.response?.data?.message || "Failed to delete event");
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <nav className="bg-gray-950 bg-opacity-80 backdrop-blur-md text-white px-8 py-4 flex justify-between items-center shadow-lg border-b border-gray-700">
        <h1 className="text-2xl font-bold text-blue-400">Admin Dashboard</h1>
        <div className="flex space-x-8 text-lg">
          <button onClick={() => setActiveTab("calendar")} className={`hover:text-blue-300 transition ${activeTab === "calendar" ? "text-blue-400 font-bold" : ""}`}>Calendar</button>
          <button onClick={() => setActiveTab("create")} className={`hover:text-blue-300 transition ${activeTab === "create" ? "text-blue-400 font-bold" : ""}`}>Create Event</button>
          <button onClick={() => setActiveTab("pending")} className={`hover:text-blue-300 transition ${activeTab === "pending" ? "text-blue-400 font-bold" : ""}`}>Pending ({pendingEvents.length})</button>
          <button onClick={() => setActiveTab("approved")} className={`hover:text-blue-300 transition ${activeTab === "approved" ? "text-blue-400 font-bold" : ""}`}>All Events ({approvedEvents.length})</button>
          <button onClick={handleLogout} className="hover:text-red-400 transition">Logout</button>
        </div>
      </nav>

      <section className="text-center py-12">
        <h2 className="text-4xl font-bold text-blue-400 tracking-wide">Welcome, <span className="text-white">Admin</span></h2>
        <p className="text-gray-400 mt-3 text-lg">
          {activeTab === "calendar" && "View all events in calendar view"}
          {activeTab === "create" && "Create and manage events"}
          {activeTab === "pending" && "Review and approve events submitted by users"}
          {activeTab === "approved" && "Manage all published events"}
        </p>
      </section>

      <div className="px-10 pb-12">
        {activeTab === "calendar" && (
          <section>
            <div className="max-w-2xl mx-auto">
              <EventCalendar events={approvedEvents} onDateClick={(date) => console.log('Selected date:', date)} />
            </div>
          </section>
        )}

        {activeTab === "create" && (
          <section>
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 bg-gray-800/80 border border-gray-700 p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-blue-400 mb-2">{editEvent ? "Edit Event" : "Create New Event"}</h3>
                <p className="text-gray-400 text-sm mb-4">✅ Admin events are automatically approved and published</p>
                <form onSubmit={handleSaveEvent} className="space-y-4">
                  <input type="text" placeholder="Event Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none" />
                  <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none" />
                  <input type="text" placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none" />
                  <input type="number" placeholder="Expected Participants" value={strength} onChange={e => setStrength(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none" />
                  <textarea placeholder="Short Description" value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-20 resize-none focus:border-blue-500 focus:outline-none" />
                  <textarea placeholder="About Event" value={about} onChange={e => setAbout(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-24 resize-none focus:border-blue-500 focus:outline-none" />
                  <textarea placeholder="Learning Outcomes" value={learning} onChange={e => setLearning(e.target.value)} className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-24 resize-none focus:border-blue-500 focus:outline-none" />
                  <div className="flex justify-end gap-4 mt-2">
                    {editEvent && <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded transition">Cancel</button>}
                    <button type="submit" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded transition font-semibold">{editEvent ? "Update Event" : "Create & Publish Event"}</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}

        {activeTab === "pending" && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-yellow-400">Pending Approval ({pendingEvents.length})</h3>
              <button onClick={getPendingEvents} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">🔄 Refresh</button>
            </div>
            {pendingEvents.length === 0 ? (
              <div className="bg-gray-800/80 border border-gray-700 p-8 rounded-2xl text-center">
                <p className="text-gray-400 text-lg">✅ No pending events to review</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingEvents.map((event) => (
                  <div key={event._id} className="bg-gray-800/80 border-2 border-yellow-600 p-6 rounded-2xl shadow-lg hover:shadow-yellow-600/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">{event.name}</h4>
                        <p className="text-gray-400 text-sm">Submitted by: <span className="text-blue-400">{event.createdBy?.fullName || "Unknown"}</span></p>
                        <p className="text-gray-400 text-sm">Email: {event.createdBy?.email || "N/A"}</p>
                      </div>
                      <span className="bg-yellow-600 text-white text-xs px-3 py-1 rounded-full">PENDING</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-300"><strong>📅 Date:</strong> {event.date}</p>
                      <p className="text-gray-300"><strong>📍 Venue:</strong> {event.venue}</p>
                      <p className="text-gray-300"><strong>👥 Strength:</strong> {event.strength}</p>
                      <p className="text-gray-300"><strong>📝 Short Desc:</strong> {event.shortDesc}</p>
                    </div>
                    <button onClick={() => setViewStates((prev) => ({ ...prev, [event._id]: !prev[event._id] }))} className="text-blue-400 hover:text-blue-300 text-sm mb-3 underline">
                      {viewStates[event._id] ? "Hide Full Details ▲" : "Show Full Details ▼"}
                    </button>
                    {viewStates[event._id] && (
                      <div className="bg-gray-700/50 p-4 rounded-lg text-gray-300 text-sm space-y-3 mb-4">
                        <div><strong className="text-white">About Event:</strong><p className="mt-1">{event.about}</p></div>
                        <div><strong className="text-white">Learning Outcomes:</strong><p className="mt-1">{event.learning}</p></div>
                        <div><strong className="text-white">Submitted At:</strong><p className="mt-1">{new Date(event.createdAt).toLocaleString()}</p></div>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button onClick={() => handleApprove(event._id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition font-semibold">✓ Approve</button>
                      <button onClick={() => handleReject(event._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition font-semibold">✗ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "approved" && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-green-400">Approved Events ({approvedEvents.length})</h3>
              <button onClick={getApprovedEvents} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">🔄 Refresh</button>
            </div>
            {approvedEvents.length === 0 && (
              <div className="bg-gray-800/80 border border-gray-700 p-8 rounded-2xl text-center">
                <p className="text-gray-400 text-lg">No approved events yet</p>
              </div>
            )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <h3 className="text-2xl font-bold text-green-400">Upcoming Events ({upcomingEvents.length})</h3>

                {upcomingEvents.map((event) => (
                  <div key={event._id} className="bg-gray-800/80 border border-green-600 p-6 rounded-2xl shadow-lg hover:shadow-green-600/20 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-white">{event.name}</h4>
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">UPCOMING EVENTS</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300 mb-3">
                      <p>📅 {event.date}</p>
                      <p>📍 {event.venue}</p>
                      <p>👥 {event.strength} participants</p>
                      <p className="text-xs text-gray-500">Created by: {event.createdBy?.fullName || "Unknown"}</p>
                      {event.createdBy?.role === "user" && <span className="inline-block mt-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">USER EVENT</span>}
                    </div>
                    <button onClick={() => setViewStates((prev) => ({ ...prev, [event._id]: !prev[event._id] }))} className="text-blue-400 hover:text-blue-300 text-sm underline">
                      {viewStates[event._id] ? "Hide Details" : "View Details"}
                    </button>
                    {viewStates[event._id] && (
                      <div className="mt-3 bg-gray-700/50 p-3 rounded-lg text-gray-300 text-sm space-y-2">
                        <p><strong>Short Desc:</strong> {event.shortDesc}</p>
                        <p><strong>About:</strong> {event.about}</p>
                        <p><strong>Learning:</strong> {event.learning}</p>
                        {event.approvedAt && <p className="text-xs text-green-400">Approved: {new Date(event.approvedAt).toLocaleString()}</p>}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleEditClick(event)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded transition text-sm">Edit</button>
                      <button onClick={() => handleDeleteApproved(event._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded transition text-sm">Delete</button>
                    </div>
                  </div>
                ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <h3 className="text-2xl font-bold text-green-400">Past Events ({pastEvents.length})</h3>

                {pastEvents.map((event) => (
                  <div key={event._id} className="bg-gray-800/80 border border-green-600 p-6 rounded-2xl shadow-lg hover:shadow-green-600/20 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-white">{event.name}</h4>
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">PAST EVENTS</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-300 mb-3">
                      <p>📅 {event.date}</p>
                      <p>📍 {event.venue}</p>
                      <p>👥 {event.strength} participants</p>
                      <p className="text-xs text-gray-500">Created by: {event.createdBy?.fullName || "Unknown"}</p>
                      {event.createdBy?.role === "user" && <span className="inline-block mt-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">USER EVENT</span>}
                    </div>
                    <button onClick={() => setViewStates((prev) => ({ ...prev, [event._id]: !prev[event._id] }))} className="text-blue-400 hover:text-blue-300 text-sm underline">
                      {viewStates[event._id] ? "Hide Details" : "View Details"}
                    </button>
                    {viewStates[event._id] && (
                      <div className="mt-3 bg-gray-700/50 p-3 rounded-lg text-gray-300 text-sm space-y-2">
                        <p><strong>Short Desc:</strong> {event.shortDesc}</p>
                        <p><strong>About:</strong> {event.about}</p>
                        <p><strong>Learning:</strong> {event.learning}</p>
                        {event.approvedAt && <p className="text-xs text-green-400">Approved: {new Date(event.approvedAt).toLocaleString()}</p>}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleEditClick(event)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded transition text-sm">Edit</button>
                      <button onClick={() => handleDeleteApproved(event._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded transition text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;