import axios from "axios";
import { useEffect, useState } from "react";
import { base_url } from "../components/baseUrl";

// Compact Event Calendar Component
function CompactEventCalendar({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);



  const eventDates = events.map((event) => {
    const dateOnly = event.date.split("T")[0];
    return dateOnly;
  });

  const getEventsForDate = (dateStr) => {
    return events.filter((event) => {
      const eventDateOnly = event.date.split("T")[0];
      return eventDateOnly === dateStr;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

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
    const yearVal = currentDate.getFullYear();
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${yearVal}-${monthStr}-${dayStr}`;
    setSelectedDate(dateStr);
    setShowEventDetails(true);
  };

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const hasEvent = eventDates.includes(dateStr);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const isToday = dateStr === todayStr;
    const isSelected = selectedDate === dateStr;

    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`aspect-square p-0.5 sm:p-1 rounded text-[10px] sm:text-xs font-medium transition-all relative flex items-center justify-center


          ${isToday ? "ring-1 ring-blue-400" : ""}
          ${isSelected ? "bg-blue-600 text-white" : ""}
          ${hasEvent && !isSelected ? "bg-green-500 text-white font-bold" : ""}
          ${!hasEvent && !isSelected
            ? "text-gray-400 hover:bg-gray-700/30"
            : ""
          }`}
      >
        {day}
      </button>
    );
  }

  const selectedDayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="bg-gray-800/90 border border-gray-700 rounded-xl shadow-lg p-3 sm:p-4 w-full max-w-xs">

      <div className="flex items-center justify-between mb-2 sm:mb-3">

        <button
          onClick={previousMonth}
          className="p-1 hover:bg-gray-700/50 rounded transition"
        >
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <polyline points="15 18 9 12 15 6" strokeWidth="2" />
          </svg>
        </button>
        <h4 className="text-sm font-semibold text-white">
          {monthNames[month]} {year}
        </h4>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-700/50 rounded transition"
        >
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <polyline points="9 18 15 12 9 6" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2 sm:mb-3"></div><div className="grid grid-cols-7 gap-1 mb-3">{calendarDays}</div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 border-t border-gray-700/50 text-[10px] sm:text-xs">

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
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-700/50">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-xs font-semibold text-gray-300">
              {new Date(
                selectedDate + "T00:00:00"
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </h5>
            <button
              onClick={() => setShowEventDetails(false)}
              className="text-gray-500 hover:text-gray-300"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {selectedDayEvents.length === 0 ? (
            <p className="text-[10px] sm:text-xs text-gray-500 italic">No events</p>
          ) : (
            <div className="space-y-1 max-h-28 sm:max-h-32 overflow-y-auto">
              {selectedDayEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-gray-700/40 p-1.5 sm:p-2 rounded text-[10px] sm:text-xs"
                >
                  <p className="text-white font-medium truncate">
                    {event.name}
                  </p>
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

function OrganizerDashboard() {
  const [eventsData, setEventsData] = useState([]);
  const [search, setSearch] = useState(""); // currently unused
  const [date, setDate] = useState("");
  const [editEvent, setEditEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [viewStates, setViewStates] = useState({});

  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [feedbackList, setFeedbackList] = useState({});
  const [loadingFeedback, setLoadingFeedback] = useState({});

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    eventId: null,
  });

  // registrations & attendance modal state
  const [attendanceEvent, setAttendanceEvent] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [loadingEventRegistrations, setLoadingEventRegistrations] =
    useState(false);

  const [notificationsData, setNotificationsData] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");

  const [activeTab, setActiveTab] = useState("events");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registrationFee, setRegistrationFee] = useState('');  // ADD THIS


  useEffect(() => {
    getAllEvents();
    getAllUsers();
  }, []);

  const loadFeedbackForEvent = async (eventId) => {
    try {
      setLoadingFeedback((prev) => ({ ...prev, [eventId]: true }));
      const res = await axios.get(`${base_url}events/${eventId}/feedback`);
      setFeedbackList((prev) => ({
        ...prev,
        [eventId]: res.data.feedbacks || [],
      }));
    } catch (err) {
      console.error("Error fetching feedback", err);
    } finally {
      setLoadingFeedback((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const getAllUsers = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }
    setLoadingUsers(true);
    axios
      .get(base_url + "users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data.users || []);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response?.data?.message || "Failed to fetch users");
      })
      .finally(() => setLoadingUsers(false));
  };

  const organizerUsers = users.filter((u) => u.role === "organizer");

  const submitFeedback = async (eventId) => {
    const text = feedbackInputs[eventId]?.trim();
    if (!text) {
      alert("Please enter feedback");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return;
      }
      await axios.post(
        `${base_url}events/${eventId}/feedback`,
        { feedback: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbackInputs((prev) => ({ ...prev, [eventId]: "" }));
      await loadFeedbackForEvent(eventId);
    } catch (err) {
      console.error("Error submitting feedback", err);
      const msg = err.response?.data?.message || "Failed to submit feedback";
      alert(msg);
    }
  };

  const getAllEvents = () => {
    axios
      .get(base_url + "events")
      .then((res) => {
        const allEvents = res.data.events;
        setEventsData(allEvents);

        const today = new Date();
        const upcoming = allEvents.filter(
          (event) => new Date(event.date) >= today
        );
        const past = allEvents.filter((event) => new Date(event.date) < today);

        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        past.sort((a, b) => new Date(b.date) - new Date(a.date));

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      })
      .catch((err) => console.log(err.message));
  };

  // Form fields
  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [strength, setStrength] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [about, setAbout] = useState("");
  const [learning, setLearning] = useState("");


  useEffect(() => {
    getAllVenues()
  }, [])
  const [useCustomVenue, setUseCustomVenue] = useState(false)

  const [venues, setVenues] = useState([])
  const getAllVenues = () => {
    axios.get(base_url + "venues")
      .then((res) => {
        setVenues(res.data.venues)
      })
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const confirmDelete = (id) => {
    setDeleteModal({ open: true, eventId: id });
  };

  const handleDeleteConfirmed = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(base_url + `events/${deleteModal.eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setEventsData(
          eventsData.filter((ev) => ev._id !== deleteModal.eventId)
        );
        getAllEvents();
        setDeleteModal({ open: false, eventId: null });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, eventId: null });
  };

  const handleSaveEvent = async (e) => {
  e.preventDefault();
  if (!name || !eventDate || !venue || !strength || !shortDesc || !about || !learning) {
    alert('Please fill all fields');
    return;
  }
  const eventData = {
    name, date: eventDate, venue, 
    strength: parseInt(strength), 
    shortDesc, about, learning,
    registrationFee: registrationFee ? parseInt(registrationFee) : 0
  };
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  
  try {
    let updatedEvents;
    if (editEvent) {
      // UPDATE
      const res = await axios.put(`${baseurl}/events/${editEvent.id}`, eventData, config);
      alert('Event updated successfully!');
      // Optimistic local update
      updatedEvents = eventsData.map(ev => ev.id === editEvent.id ? { ...ev, ...eventData } : ev);
    } else {
      // CREATE
      const res = await axios.post(`${baseurl}/events`, eventData, config);
      alert('Event created successfully!');
      updatedEvents = [...eventsData, res.data.event];  // Assume backend returns new event
    }
    setEventsData(updatedEvents);
    resetForm();
  } catch (err) {
    console.error('Save error:', err.response?.data);
    alert(err.response?.data?.message || 'Failed to save event');
  }
};


  const resetForm = () => {
  setEditEvent(null);
  setName('');
  setEventDate('');
  setVenue('');
  setStrength('');
  setShortDesc('');
  setAbout('');
  setLearning('');
  setRegistrationFee('');  // Add this
  setUseCustomVenue(false);
};

const handleEditClick = (event) => {
  console.log('Full event:', event);  // DEBUG
  setEditEvent(event);
  setName(event.name || '');
  setEventDate(event.date.slice(0,10) || '');  // YYYY-MM-DD format
  setVenue(event.venue || '');
  setStrength(event.strength?.toString() || '');
  setShortDesc(event.shortDesc || '');
  setAbout(event.about || '');
  setLearning(event.learning || '');
  setRegistrationFee(event.registrationFee?.toString() || '');
  setShowEventForm(true);
  setActiveTab('eventForm');  // Ensure tab switches
};


  // Filter events by selected date
  const filteredUpcomingEvents = date
    ? upcomingEvents.filter((event) => event.date === date)
    : upcomingEvents;

  // attendance modal helpers
  const openAttendanceModal = async (event) => {
    try {
      setAttendanceEvent(event);
      setEventRegistrations([]);
      setLoadingEventRegistrations(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return;
      }

      const res = await axios.get(
        `${base_url}events/${event._id}/registrations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEventRegistrations(res.data.registrations || []);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Failed to load registrations for this event"
      );
    } finally {
      setLoadingEventRegistrations(false);
    }
  };

  const closeAttendanceModal = () => {
    setAttendanceEvent(null);
    setEventRegistrations([]);
  };

  const handleNotifications = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }
    setLoadingNotifications(true);
    axios
      .get(base_url + "notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotificationsData(res.data.notifications || []))
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Failed to load notifications");
      })
      .finally(() => setLoadingNotifications(false));
  };

  const handleMarkOneRead = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }
    axios
      .put(
        base_url + `notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setNotificationsData((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Failed to update notification");
      });
  };

  const handleMarkAllRead = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }
    axios
      .put(
        base_url + "notifications/read-all",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setNotificationsData((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Failed to update notifications");
      });
  };

  const markAttendance = async (userId, status) => {
    if (!attendanceEvent) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return;
      }

      await axios.post(
        `${base_url}events/${attendanceEvent._id}/attendance`,
        { userId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEventRegistrations((prev) =>
        prev.map((r) =>
          r.userId === userId ? { ...r, attendanceStatus: status } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to update attendance"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Fixed calendar on the left for large screens */}

      {/* Main content shifted right so it doesn't overlap calendar */}
      {/* Navbar */}
      {/* Responsive Navbar - Copy from UserDashboard */}
      <nav className="bg-gray-950/80 backdrop-blur-md text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">
            Event Coordination Engine
          </h1>

          {/* Desktop nav - hidden on mobile */}
          <div className="hidden md:flex md:items-center md:space-x-5 lg:space-x-8 text-sm lg:text-lg">
            <button onClick={() => setActiveTab("calendar")}
              className={`px-2 py-1 rounded hover:text-blue-300 transition ${activeTab === "calendar" ? "text-blue-300 underline" : ""}`}>
              Calendar
            </button>
            <button onClick={() => setActiveTab("events")}
              className={`px-2 py-1 rounded hover:text-blue-300 transition ${activeTab === "events" ? "text-blue-300 underline" : ""}`}>
              All Events
            </button>
            <button onClick={() => setActiveTab("users")}
              className={`px-2 py-1 rounded hover:text-blue-300 transition ${activeTab === "users" ? "text-blue-300 underline" : ""}`}>
              Users
            </button>
            <button onClick={() => { handleNotifications(); setActiveTab("notifications"); }}
              className="px-2 py-1 rounded hover:text-red-400 transition">
              Notifications
            </button>
            <button onClick={() => { setShowEventForm(true); setActiveTab("eventForm"); }}
              className="px-2 py-1 rounded hover:text-green-300 transition">
              Create Event
            </button>
            <button onClick={handleLogout}
              className="px-2 py-1 rounded hover:text-red-400 transition">
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMobileOpen(prev => !prev)}>
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 border-t border-gray-800 pt-2">
            <div className="flex flex-col space-y-1 text-sm px-2">
              <button onClick={() => { setActiveTab("calendar"); setMobileOpen(false); }}
                className="text-left px-3 py-2 rounded hover:bg-gray-800">
                Calendar
              </button>
              <button onClick={() => { setActiveTab("events"); setMobileOpen(false); }}
                className="text-left px-3 py-2 rounded hover:bg-gray-800">
                All Events
              </button>
              <button onClick={() => { setActiveTab("users"); setMobileOpen(false); }}
                className="text-left px-3 py-2 rounded hover:bg-gray-800">
                Users
              </button>
              <button onClick={() => { handleNotifications(); setActiveTab("notifications"); setMobileOpen(false); }}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 text-red-300">
                Notifications
              </button>
              <button onClick={() => { setShowEventForm(true); setActiveTab("eventForm"); setMobileOpen(false); }}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 text-green-300">
                Create Event
              </button>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 text-red-300">
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>


      {/* Hero Section */}
      {/* Hero Section */}
      <section className="text-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 tracking-wide">
          Welcome, <span className="text-white">Organizer</span>
        </h2>

        <p className="text-gray-400 mt-2 sm:mt-3 text-sm sm:text-base">
          {activeTab === "events" && "Discover and register for exciting upcoming events"}
          {activeTab === "registered" && "View events you have registered for"}
          {activeTab === "attended" && "Review events you have already attended"}
          {activeTab === "notifications" && "See your latest notifications"}
          {activeTab === "eventForm" && "Create or edit your events for admin approval"}
        </p>
        {/* Calendar tab */}
        {activeTab === "calendar" && (
          <section className="px-4 sm:px-6 lg:px-10 pb-12">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-400">
                Event Calendar
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mt-2">
                View all events in calendar view
              </p>
            </div>
            <CompactEventCalendar events={eventsData} />
          </section>
        )}


        {activeTab === "events" && (
          <button
            onClick={() => setActiveTab("events")}
            className="mt-4 sm:mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg transition text-sm sm:text-base"
          >
            Browse Events
          </button>
        )}

        {activeTab === "registered" && (
          <button
            onClick={() => setActiveTab("registered")}
            className="mt-4 sm:mt-6 bg-green-600 hover:bg-green-700 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg transition text-sm sm:text-base"
          >
            View Registered Events
          </button>
        )}

        {activeTab === "attended" && (
          <button
            onClick={() => setActiveTab("attended")}
            className="mt-4 sm:mt-6 bg-purple-600 hover:bg-purple-700 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg transition text-sm sm:text-base"
          >
            View Attended Events
          </button>
        )}

        {activeTab === "notifications" && (
          <button
            onClick={() => setActiveTab("notifications")}
            className="mt-4 sm:mt-6 bg-red-600 hover:bg-red-700 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg transition text-sm sm:text-base"
          >
            View Notifications
          </button>
        )}

        {activeTab === "eventForm" && (
          <button
            onClick={() => setActiveTab("eventForm")}
            className="mt-4 sm:mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg transition text-sm sm:text-base"
          >
            Create Event
          </button>
        )}
      </section>



      {/* Event Creation/Edit Form */}
      {(activeTab === "eventForm" && showEventForm) && (
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
          <form onSubmit={handleSaveEvent} className="space-y-4">
            <input
              type="text"
              placeholder="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
            />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
            />
            <select
              value={useCustomVenue ? "other" : venue}
              onChange={(e) => {
                if (e.target.value === "other") {
                  setUseCustomVenue(true);
                  setVenue("");
                } else {
                  setUseCustomVenue(false);
                  setVenue(e.target.value);
                }
              }}
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a venue</option>
              {venues?.map((venue, id) =>
                <option key={id} value={venue?.name}>{venue?.name}</option>
              )}
              <option value="other">
                Others (manual entry)
              </option>
            </select>
            {useCustomVenue && (
              <input
                type="text"
                placeholder="Enter venue manually"
                value={venue}
                onChange={(e) =>
                  setVenue(e.target.value)
                }
                className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
              />
            )}
            <input
              type="number"
              placeholder="Expected Participants"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
            />
            {/* Registration Fee Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Registration Fee (₹)
              </label>
              <input
                type="number"
                placeholder="Enter 0 for free event"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
                min="0"
                className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
              />
              <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg">
                <p className="text-blue-300 text-xs">
                  💡 <strong>Tip:</strong> Enter <strong>0</strong> for free events.
                  Users will be registered directly without payment. For paid events,
                  enter the amount in ₹ (e.g., 500 for ₹500). Users will complete
                  payment via Razorpay before registration.
                </p>
              </div>
            </div>
            <textarea

              placeholder="Short Description"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-20 resize-none focus:border-blue-500 focus:outline-none"
            />
            <textarea
              placeholder="About Event"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-24 resize-none focus:border-blue-500 focus:outline-none"
            />
            <textarea
              placeholder="Learning Outcomes"
              value={learning}
              onChange={(e) => setLearning(e.target.value)}
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
                {editEvent ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="px-4 sm:px-6 lg:px-4 pb-10">
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-blue-400">
                Notifications ({notificationsData.length})
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={handleNotifications}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  🔄 Refresh
                </button>
                <button
                  onClick={handleMarkAllRead}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition text-sm"
                >
                  Mark all as read
                </button>
              </div>
            </div>

            {notificationsData.length === 0 ? (
              <div className="bg-gray-800/80 border border-gray-700 p-8 rounded-2xl text-center">
                <p className="text-gray-400 text-lg">
                  ✅ No notifications right now
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {notificationsData.map((n) => (
                  <div
                    key={n._id}
                    className={`bg-gray-800/80 border-2 p-6 rounded-2xl shadow-lg transition-all ${n.isRead
                      ? "border-gray-700 hover:shadow-gray-500/20"
                      : "border-blue-500 hover:shadow-blue-500/30"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-1">
                          {n.title}
                        </h4>
                        <p className="text-gray-300 text-sm whitespace-pre-line">
                          {n.message}
                        </p>
                        
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${n.isRead
                          ? "bg-gray-600 text-white"
                          : "bg-blue-600 text-white"
                          }`}
                      >
                        {n.isRead ? "READ" : "NEW"}
                      </span>
                    </div>

                    <div className="mb-3 text-xs text-gray-400">
                      {n.createdAt && (
                        <span>
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkOneRead(n._id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition font-semibold text-sm"
                        >
                          ✓ Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Events (upcoming + past) */}
      {activeTab === "events" && (
        <div className="px-4 sm:px-6 lg:px-10 pb-12 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-10 relative">
            {/* Browse by Date */}
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
                <h3 className="text-2xl font-bold mb-6 text-blue-400">
                  Upcoming Events
                </h3>
                {filteredUpcomingEvents.length === 0 ? (
                  <p className="text-gray-400">
                    No upcoming events right now.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

                    {filteredUpcomingEvents.map((event) => {
                      return (
                        <div
                          key={event._id}
                          className="bg-gray-800/80 border border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-blue-400/20 transition-all"
                        >
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {event.name}
                          </h4>
                          <p className="text-gray-400 text-sm mb-1">
                            📅 {event.date}
                          </p>
                          <p className="text-gray-400 text-sm mb-1">
                            📍 {event.venue}
                          </p>
                          <p className="text-gray-400 text-sm mb-1">
                            📝 {event.shortDesc}
                          </p>
                          <p className="font-semibold">
                            Fee: {!event.registrationFee || event.registrationFee === 0 ?
                              <span className="text-green-400">FREE</span> :
                              <span className="text-yellow-400">{event.registrationFee}</span>
                            }
                          </p>

                          <div className="flex flex-col gap-2 mt-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditClick(event)}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => confirmDelete(event._id)}
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() =>
                                  setViewStates((prev) => ({
                                    ...prev,
                                    [event._id]: !prev[event._id],
                                  }))
                                }
                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
                              >
                                {viewStates[event._id]
                                  ? "Hide Details"
                                  : "View"}
                              </button>
                            </div>
                            <button
                              onClick={() => openAttendanceModal(event)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded self-start"
                            >
                              Registrations / Attendance
                            </button>
                          </div>

                          {viewStates[event._id] && (
                            <div className="mt-4 bg-gray-700/50 p-3 rounded-lg text-gray-300 text-sm space-y-2">
                              <p>
                                <strong>About Event:</strong> {event.about}
                              </p>
                              <p>
                                <strong>Learning Outcomes:</strong>{" "}
                                {event.learning}
                              </p>
                              <p>
                                <strong>Full Description:</strong>{" "}
                                {event.shortDesc}
                              </p>
                              <p>
                                <strong>Strength:</strong> {event.strength}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Past Events */}
              <section id="past-events" className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-blue-400">
                  Past Events
                </h3>
                {pastEvents.length === 0 ? (
                  <p className="text-gray-400">No past events yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.map((event) => {
                      return (
                        <div
                          key={event._id}
                          className="bg-gray-800/80 border border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-gray-500/30 transition-all"
                        >
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {event.name}
                          </h4>
                          <p className="text-gray-400 text-sm mb-1">
                            📅 {event.date}
                          </p>
                          <p className="text-gray-400 text-sm mb-1">
                            📍 {event.venue}
                          </p>
                          <p className="text-gray-400 text-sm mb-1">
                            👥 Strength: {event.strength}
                          </p>
                          <p className="text-gray-400 text-sm mb-2">
                            📝 {event.shortDesc}
                          </p>
                          <p className="font-semibold">
                            Fee: {!event.registrationFee || event.registrationFee === 0 ?
                              <span className="text-green-400">FREE</span> :
                              <span className="text-yellow-400">{event.registrationFee}</span>
                            }
                          </p>


                          {/* Feedback input */}
                          <div className="mt-3">
                            <label className="block text-xs text-gray-400 mb-1">
                              Your Feedback
                            </label>
                            <textarea
                              rows={2}
                              placeholder="Share your experience about this event"
                              value={feedbackInputs[event._id] || ""}
                              onChange={(e) =>
                                setFeedbackInputs((prev) => ({
                                  ...prev,
                                  [event._id]: e.target.value,
                                }))
                              }
                              className="w-full p-2 rounded bg-gray-900 border border-gray-600 text-white text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <div className="flex justify-between items-center mt-2">
                              <button
                                onClick={() => submitFeedback(event._id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded transition"
                              >
                                Submit Feedback
                              </button>
                              <button
                                onClick={() =>
                                  loadFeedbackForEvent(event._id)
                                }
                                className="text-xs text-blue-300 underline hover:text-blue-200"
                              >
                                {loadingFeedback[event._id]
                                  ? "Loading..."
                                  : "View Feedbacks"}
                              </button>
                            </div>
                          </div>

                          {/* Feedback list */}
                          {feedbackList[event._id] &&
                            feedbackList[event._id].length > 0 && (
                              <div className="mt-3 border-t border-gray-700 pt-2 max-h-32 overflow-y-auto">
                                <p className="text-xs text-gray-400 mb-1">
                                  Feedback from participants:
                                </p>
                                {feedbackList[event._id].map((fb) => (
                                  <div key={fb._id} className="mb-2">
                                    <p className="text-xs text-blue-300 font-semibold">
                                      {fb.userName || "User"}
                                    </p>
                                    <p className="text-xs text-gray-200">
                                      {fb.feedback}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Registrations / Attendance */}
                          <div className="mt-3">
                            <button
                              onClick={() => openAttendanceModal(event)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded"
                            >
                              Registrations / Attendance
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === "users" && (
        <div className="px-4 sm:px-6 lg:px-10 pb-16" id="users">
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">
              Organizers
            </h3>
            {loadingUsers ? (
              <p className="text-gray-400 text-sm">
                Loading organizers...
              </p>
            ) : organizerUsers.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No organizers found.
              </p>
            ) : (
              <div className="bg-gray-800/80 border border-gray-700 rounded-2xl overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-900/80">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-300">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-gray-300">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-gray-300">
                        Branch
                      </th>
                      <th className="px-4 py-2 text-left text-gray-300">
                        Roll No.
                      </th>
                      <th className="px-4 py-2 text-left text-gray-300">
                        Approved
                      </th>
                      <th className="px-4 py-2 text-left text-gray-300">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizerUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="border-t border-gray-700"
                      >
                        <td className="px-4 py-2 text-white">
                          {u.fullName}
                        </td>
                        <td className="px-4 py-2 text-gray-300">
                          {u.email}
                        </td>
                        <td className="px-4 py-2 text-gray-300">
                          {u.branch || "-"}
                        </td>
                        <td className="px-4 py-2 text-gray-300">
                          {u.rollNumber || "-"}
                        </td>
                        <td className="px-4 py-2 text-gray-300">
                          {u.approved ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-2 text-gray-400">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Attendance modal */}
      {attendanceEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-400">
                Registrations & Attendance
              </h3>
              <button
                onClick={closeAttendanceModal}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-300 mb-1">
              <span className="font-semibold">Event:</span>{" "}
              {attendanceEvent.name}
            </p>
            <p className="text-xs text-gray-400 mb-4">
              📅 {attendanceEvent.date} · 📍 {attendanceEvent.venue}
            </p>

            {loadingEventRegistrations ? (
              <p className="text-sm text-gray-400">
                Loading registrations...
              </p>
            ) : eventRegistrations.length === 0 ? (
              <p className="text-sm text-gray-500">
                No users have registered for this event.
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-800 text-gray-300">
                    <tr>
                      <th className="px-2 py-1">Name</th>
                      <th className="px-2 py-1">Email</th>
                      <th className="px-2 py-1">Branch</th>
                      <th className="px-2 py-1">Roll</th>
                      <th className="px-2 py-1">Status</th>
                      <th className="px-2 py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventRegistrations.map((r) => {
                      const eventDateObj = new Date(attendanceEvent.date);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      eventDateObj.setHours(0, 0, 0, 0);
                      const canMarkAttendance = eventDateObj <= today;
                      return (
                        <tr
                          key={r.userId}
                          className="border-t border-gray-800"
                        >
                          <td className="px-2 py-1 text-gray-100">
                            {r.fullName}
                          </td>
                          <td className="px-2 py-1 text-gray-300">
                            {r.email}
                          </td>
                          <td className="px-2 py-1 text-gray-300">
                            {r.branch || "-"}
                          </td>
                          <td className="px-2 py-1 text-gray-300">
                            {r.rollNumber || "-"}
                          </td>
                          <td className="px-2 py-1">
                            {r.attendanceStatus === "present" && (
                              <span className="text-green-400 font-semibold">
                                Present
                              </span>
                            )}
                            {r.attendanceStatus === "absent" && (
                              <span className="text-red-400 font-semibold">
                                Absent
                              </span>
                            )}
                            {r.attendanceStatus === "not_marked" && (
                              <span className="text-gray-400">
                                Not marked
                              </span>
                            )}
                          </td>
                          <td className="px-2 py-1">
                            <div className="flex gap-1">
                              <button
                                disabled={!canMarkAttendance}
                                onClick={() =>
                                  markAttendance(r.userId, "present")
                                }
                                className={`bg-green-600 hover:bg-green-700 text-white px-2 py-0.5 rounded ${!canMarkAttendance
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                                  }`}
                              >
                                Present
                              </button>
                              <button
                                disabled={!canMarkAttendance}
                                onClick={() =>
                                  markAttendance(r.userId, "absent")
                                }
                                className={`bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded ${!canMarkAttendance
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                                  }`}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-80 text-white">
            <h3 className="text-xl font-bold mb-4 text-red-500">
              Confirm Delete
            </h3>
            <p className="mb-6">
              Are you sure you want to delete this event?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

export default OrganizerDashboard;
