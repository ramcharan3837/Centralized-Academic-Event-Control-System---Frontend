import axios from "axios";
import { useEffect, useState } from "react";
import { base_url } from "../components/baseUrl";
import EmailButtons from "../components/EmailButtons";
import CSVDownloadButtons from "../components/CSVDownloadButtons";
import SponsorImageManager from "../components/SponsorImageManager";

function EventCalendar({ events = [], onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);


  const eventDates = events.map((event) => {
    const dateStr = String(event.date);
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  });

  const getEventsForDate = (dateStr) => {
    return events.filter((event) => {
      const raw = String(event.date);
      const onlyDate = raw.includes("T") ? raw.split("T")[0] : raw;
      return onlyDate === dateStr;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    const dateStr = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    if (onDateClick) onDateClick(dateStr);
  };

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const hasEvent = eventDates.includes(dateStr);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const isToday = todayStr === dateStr;
    const isSelected = selectedDate === dateStr;
    const dayEvents = getEventsForDate(dateStr);

    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`aspect-square  p-1 sm:p-2 rounded-lg text-[10px] sm:text-sm font-medium transition-all hover:scale-105 hover:shadow-lg relative
          ${isToday ? "ring-2 ring-blue-500" : ""}
          ${isSelected ? "bg-blue-600 text-white" : "bg-gray-800/50 text-gray-300"}
          ${hasEvent && !isSelected
            ? "bg-green-600/30 border-2 border-green-500"
            : ""
          }
          ${!hasEvent && !isSelected
            ? "hover:bg-gray-700/50"
            : ""
          }`}
      >
        <span className="relative z-10">{day}</span>
        {hasEvent && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {dayEvents.slice(0, 3).map((_, idx) => (
              <div
                key={idx}
                className="w-1 h-1 rounded-full bg-green-400"
              />
            ))}
          </div>
        )}
      </button>
    );
  }

  const selectedDayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-6">

        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2 rounded-lg">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
                strokeWidth="2"
              />
              <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                strokeWidth="2"
              />
              <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                strokeWidth="2"
              />
              <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Event Calendar
            </h3>
            <p className="text-xs text-gray-400">
              Click dates to view events
            </p>
          </div>
        </div>
        <button
          onClick={goToToday}
          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium transition"
        >
          Today
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <polyline
              points="15 18 9 12 15 6"
              strokeWidth="2"
            />
          </svg>
        </button>
        <h4 className="text-lg font-semibold text-white">
          {monthNames[month]} {year}
        </h4>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <polyline
              points="9 18 15 12 9 6"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">{calendarDays}</div>

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
            Events on{" "}
            {new Date(
              selectedDate + "T00:00:00"
            ).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h4>
          {selectedDayEvents.length === 0 ? (
            <p className="text-xs text-gray-500 italic">
              No events scheduled
            </p>
          ) : (
            <div className="space-y-2">
              {selectedDayEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-gray-700/30 border border-green-500/30 p-3 rounded-lg hover:border-green-500/50 transition"
                >
                  <p className="text-sm font-medium text-white mb-1">
                    {event.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {event.venue}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {event.strength} participants
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UserTable({ rows, onChangeRole, onViewProfile }) {
  return (
    <div className="overflow-x-auto bg-gray-800/80 border border-gray-700 rounded-2xl">
      <table className="min-w-full text-xs sm:text-sm">
        <thead className="bg-gray-900/80">
          <tr>
            <th className="px-4 py-2 text-left text-gray-300">
              Name
            </th>
            <th className="px-4 py-2 text-left text-gray-300">
              Email
            </th>
            <th className="px-4 py-2 text-left text-gray-300">
              Role
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
            <th className="px-4 py-2 text-left text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
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
                {u.role}
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
              <td className="px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onViewProfile(u)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                  >
                    View Profile
                  </button>
                  {u.role === "user" && (
                    <button
                      onClick={() =>
                        onChangeRole(u._id, "organizer")
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded"
                    >
                      Make Organizer
                    </button>
                  )}
                  {u.role !== "admin" && (
                    <button
                      onClick={() => onChangeRole(u._id, "admin")}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                    >
                      Make Admin
                    </button>
                  )}
                  {u.role !== "user" && (
                    <button
                      onClick={() => onChangeRole(u._id, "user")}
                      className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1 rounded"
                    >
                      Make User
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [feedbackList, setFeedbackList] = useState({});
  const [loadingFeedback, setLoadingFeedback] = useState({});

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Attendance UI
  const [attendanceEvent, setAttendanceEvent] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [loadingEventRegistrations, setLoadingEventRegistrations] =
    useState(false);
  const [registrationFee, setRegistrationFee] = useState("");

  // User profile modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loadingUserRegistrations, setLoadingUserRegistrations] =
    useState(false);

  const userUsers = users.filter((u) => u.role === "user");
  const organizerUsers = users.filter((u) => u.role === "organizer");
  const adminUsers = users.filter((u) => u.role === "admin");

  const userBranchNames = Array.from(
    new Set(userUsers.map((u) => u.branch || "Unknown"))
  ).sort();

  const [selectedUserBranch, setSelectedUserBranch] = useState("");
  const filteredUserUsers = selectedUserBranch
    ? userUsers.filter(
      (u) => (u.branch || "Unknown") === selectedUserBranch
    )
    : userUsers;

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  // Venues state
  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [venueCapacity, setVenueCapacity] = useState("");
  const [venueNotes, setVenueNotes] = useState("");
  const [useCustomVenue, setUseCustomVenue] = useState(false);

  // Notifications state
  const [notificationsData, setNotificationsData] = useState([]);
  const [loadingNotifications, setLoadingNotifications] =
    useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  // ============================================
  // NEW: CSV DOWNLOAD HELPER FUNCTIONS
  // ============================================

  // Convert data to CSV format
  const convertToCSV = (data, headers) => {
    if (!data || data.length === 0) return '';

    const headerRow = headers.map(h => h.title).join(',');
    const rows = data.map(row => {
      return headers.map(h => {
        const value = row[h.id] || '';
        const escapedValue = String(value).replace(/"/g, '""');
        return `"${escapedValue}"`;
      }).join(',');
    });

    return [headerRow, ...rows].join('\n');
  };

  // Helper to download CSV
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download All Users CSV
  const handleDownloadAllUsers = () => {
    const headers = [
      { id: 'id', title: 'User ID' },
      { id: 'fullName', title: 'Full Name' },
      { id: 'email', title: 'Email' },
      { id: 'rollNumber', title: 'Roll Number' },
      { id: 'branch', title: 'Branch' },
      { id: 'role', title: 'Role' },
      { id: 'approved', title: 'Approved' },
      { id: 'createdAt', title: 'Created At' }
    ];

    const userData = users.map(user => ({
      id: user._id || '',
      fullName: user.fullName || '',
      email: user.email || '',
      rollNumber: user.rollNumber || '',
      branch: user.branch || '',
      role: user.role || '',
      approved: user.approved ? 'Yes' : 'No',
      createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
    }));

    const csvContent = convertToCSV(userData, headers);
    downloadCSV(csvContent, `all-users-${Date.now()}.csv`);
    alert(`Downloaded ${users.length} users!`);
  };

  // Download Filtered Users CSV (based on current filters)
  const handleDownloadFilteredUsers = () => {
    let filteredData = [];
    let filterName = '';

    if (selectedUserBranch) {
      filteredData = filteredUserUsers;
      filterName = `${selectedUserBranch}-users`;
    } else {
      filteredData = users;
      filterName = 'all-users';
    }

    const headers = [
      { id: 'id', title: 'User ID' },
      { id: 'fullName', title: 'Full Name' },
      { id: 'email', title: 'Email' },
      { id: 'rollNumber', title: 'Roll Number' },
      { id: 'branch', title: 'Branch' },
      { id: 'role', title: 'Role' },
      { id: 'approved', title: 'Approved' },
      { id: 'createdAt', title: 'Created At' }
    ];

    const userData = filteredData.map(user => ({
      id: user._id || '',
      fullName: user.fullName || '',
      email: user.email || '',
      rollNumber: user.rollNumber || '',
      branch: user.branch || '',
      role: user.role || '',
      approved: user.approved ? 'Yes' : 'No',
      createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
    }));

    const csvContent = convertToCSV(userData, headers);
    downloadCSV(csvContent, `${filterName}-${Date.now()}.csv`);
    alert(`Downloaded ${filteredData.length} users!`);
  };

  // Download All Events CSV
  const handleDownloadAllEvents = () => {
    const headers = [
      { id: 'id', title: 'Event ID' },
      { id: 'name', title: 'Event Name' },
      { id: 'date', title: 'Date' },
      { id: 'venue', title: 'Venue' },
      { id: 'strength', title: 'Capacity' },
      { id: 'shortDesc', title: 'Description' },
      { id: 'registrationFee', title: 'Registration Fee' },
      { id: 'approved', title: 'Approved' },
      { id: 'createdBy', title: 'Created By' },
      { id: 'createdAt', title: 'Created At' }
    ];

    const eventData = approvedEvents.map(event => ({
      id: event._id || '',
      name: event.name || '',
      date: event.date || '',
      venue: event.venue || '',
      strength: event.strength || 0,
      shortDesc: event.shortDesc || '',
      registrationFee: event.registrationFee || 0,
      approved: event.approved ? 'Yes' : 'No',
      createdBy: event.createdBy?.fullName || event.createdBy?.email || '',
      createdAt: event.createdAt ? new Date(event.createdAt).toLocaleDateString() : ''
    }));

    const csvContent = convertToCSV(eventData, headers);
    downloadCSV(csvContent, `all-events-${Date.now()}.csv`);
    alert(`Downloaded ${approvedEvents.length} events!`);
  };

  // Download Event-Specific Users CSV
  const handleDownloadEventUsers = async (event) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${base_url}events/${event._id}/registrations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const registrations = response.data.registrations || [];

      if (registrations.length === 0) {
        alert('No users registered for this event.');
        return;
      }

      const headers = [
        { id: 'eventName', title: 'Event Name' },
        { id: 'eventDate', title: 'Event Date' },
        { id: 'fullName', title: 'Full Name' },
        { id: 'email', title: 'Email' },
        { id: 'rollNumber', title: 'Roll Number' },
        { id: 'branch', title: 'Branch' },
        { id: 'attendanceStatus', title: 'Attendance Status' }
      ];

      const userData = registrations.map(reg => ({
        eventName: event.name,
        eventDate: event.date,
        fullName: reg.fullName || '',
        email: reg.email || '',
        rollNumber: reg.rollNumber || '',
        branch: reg.branch || '',
        attendanceStatus: reg.attendanceStatus || 'not_marked'
      }));

      const csvContent = convertToCSV(userData, headers);
      downloadCSV(csvContent, `${event.name}-registered-users-${Date.now()}.csv`);
      alert(`Downloaded ${registrations.length} registered users for ${event.name}!`);
    } catch (error) {
      console.error('Error downloading event users:', error);
      alert('Failed to download event users. Please try again.');
    }
  };
  // ============================================
  // END OF CSV HELPER FUNCTIONS
  // ============================================

  useEffect(() => {
    getPendingEvents();
    getApprovedEvents();
    getAllUsers();
    loadVenues();
  }, []);

  const getPendingEvents = () => {
    const token = localStorage.getItem("token");
    axios
      .get(base_url + "events/pending", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPendingEvents(res?.data?.events || []))
      .catch((err) => {
        console.log(err.message);
        alert(
          err.response?.data?.message ||
          "Failed to fetch pending events"
        );
      });
  };

  const getApprovedEvents = () => {
    axios
      .get(base_url + "events")
      .then((res) => {
        const allEvents = res.data.events || [];
        setApprovedEvents(allEvents);

        const today = new Date();
        const upcoming = allEvents.filter(
          (event) => new Date(event.date) >= today
        );
        const past = allEvents.filter(
          (event) => new Date(event.date) < today
        );

        upcoming.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        past.sort((a, b) => new Date(b.date) - new Date(a.date));

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      })
      .catch((err) => console.log(err.message));
  };

  const loadFeedbackForEvent = async (eventId) => {
    try {
      setLoadingFeedback((prev) => ({ ...prev, [eventId]: true }));
      const res = await axios.get(
        `${base_url}events/${eventId}/feedback`
      );
      setFeedbackList((prev) => ({
        ...prev,
        [eventId]: res.data.feedbacks || [],
      }));
    } catch (err) {
      console.error("Error fetching feedback", err);
      alert("Failed to load feedback");
    } finally {
      setLoadingFeedback((prev) => ({ ...prev, [eventId]: false }));
    }
  };

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
      const msg =
        err.response?.data?.message || "Failed to submit feedback";
      alert(msg);
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
      .then((res) => setUsers(res.data.users || []))
      .catch((err) => {
        console.log(err);
        alert(
          err.response?.data?.message || "Failed to fetch users"
        );
      })
      .finally(() => setLoadingUsers(false));
  };

  const loadVenues = () => {
    setLoadingVenues(true);
    axios
      .get(base_url + "venues")
      .then((res) => setVenues(res.data.venues || []))
      .catch((err) => {
        console.error(err);
        alert(
          err.response?.data?.message || "Failed to fetch venues"
        );
      })
      .finally(() => setLoadingVenues(false));
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !eventDate ||
      !venue ||
      !strength ||
      !shortDesc ||
      !about ||
      !learning

    ) {
      alert("Please fill all required fields");
      return;
    }

    const eventData = {
      name,
      date: eventDate,
      venue,
      strength: parseInt(strength),
      shortDesc,
      about,
      learning,
      registrationFee: registrationFee ? parseInt(registrationFee) : 0, // ADD THIS LINE
    };

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    if (editEvent) {
      axios
        .put(base_url + `events/${editEvent._id}`, eventData, config)
        .then((res) => {
          alert(res.data.message || "Event updated successfully!");
          resetForm();
          getPendingEvents();
          getApprovedEvents();
        })
        .catch((err) => {
          console.log(err);
          alert(
            err.response?.data?.message ||
            "Failed to update event"
          );
        });
    } else {
      axios
        .post(base_url + "events", eventData, config)
        .then((res) => {
          alert(res.data.message || "Event created successfully!");
          resetForm();
          getPendingEvents();
          getApprovedEvents();
        })
        .catch((err) => {
          console.log(err);
          alert(
            err.response?.data?.message ||
            "Failed to create event"
          );
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
    setRegistrationFee(""); // ADD THIS LINE
  };

  const handleEditClick = (event) => {
    setEditEvent(event);
    setName(event.name);
    setEventDate(
      typeof event.date === "string"
        ? event.date.slice(0, 10)
        : new Date(event.date).toISOString().slice(0, 10)
    );
    setVenue(event.venue);
    setStrength(event.strength);
    setShortDesc(event.shortDesc);
    setAbout(event.about);
    setLearning(event.learning);
    setRegistrationFee(event.registrationFee || ""); // ADD THIS LINE
    setActiveTab("create");
  };
  const handleApprove = (eventId) => {
    const token = localStorage.getItem("token");
    if (
      !window.confirm(
        "Are you sure you want to approve this event?"
      )
    )
      return;
    axios
      .put(
        base_url + `events/${eventId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Event approved successfully!");
        getPendingEvents();
        getApprovedEvents();
      })
      .catch((err) => {
        console.log(err);
        alert(
          err.response?.data?.message ||
          "Failed to approve event"
        );
      });
  };

  const handleReject = (eventId) => {
    const token = localStorage.getItem("token");
    if (
      !window.confirm(
        "Are you sure you want to reject and delete this event?"
      )
    )
      return;
    axios
      .delete(base_url + `events/${eventId}/reject`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Event rejected successfully!");
        getPendingEvents();
      })
      .catch((err) => {
        console.log(err);
        alert(
          err.response?.data?.message ||
          "Failed to reject event"
        );
      });
  };

  const handleDeleteApproved = (eventId) => {
    const token = localStorage.getItem("token");
    if (
      !window.confirm(
        "Are you sure you want to delete this approved event?"
      )
    )
      return;
    axios
      .delete(base_url + `events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Event deleted successfully!");
        getApprovedEvents();
      })
      .catch((err) => {
        console.log(err);
        alert(
          err.response?.data?.message ||
          "Failed to delete event"
        );
      });
  };

  const handleChangeRole = (userId, newRole) => {
    if (
      !window.confirm(
        `Are you sure you want to make this user ${newRole}?`
      )
    )
      return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }
    axios
      .put(
        base_url + `users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        alert(res.data.message || "User role updated");
        getAllUsers();
      })
      .catch((err) => {
        console.log(err);
        alert(
          err.response?.data?.message || "Failed to update role"
        );
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleNotifications = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }
    setLoadingNotifications(true);
    setNotificationsError("");
    axios
      .get(base_url + "notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setNotificationsData(res.data.notifications || [])
      )
      .catch((err) => {
        console.error(err);
        setNotificationsError(
          err.response?.data?.message ||
          "Failed to load notifications"
        );
        alert(
          err.response?.data?.message ||
          "Failed to load notifications"
        );
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
          prev.map((n) =>
            n._id === id ? { ...n, isRead: true } : n
          )
        );
      })
      .catch((err) => {
        console.error(err);
        alert(
          err.response?.data?.message ||
          "Failed to update notification"
        );
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
        alert(
          err.response?.data?.message ||
          "Failed to update notifications"
        );
      });
  };

  // User profile modal
  const loadUserRegistrations = async (user) => {
    try {
      setSelectedUser(user);
      setUserRegistrations([]);
      setLoadingUserRegistrations(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return;
      }
      const res = await axios.get(
        `${base_url}users/${user._id}/registrations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserRegistrations(res.data.events || []);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Failed to load registrations for this user"
      );
    } finally {
      setLoadingUserRegistrations(false);
    }
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setUserRegistrations([]);
  };

  // Attendance modal
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
        err.response?.data?.message ||
        "Failed to update attendance"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
      <nav className="bg-gray-950/80 backdrop-blur-md text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-gray-700 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">
            Admin Dashboard
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-2 py-1 rounded hover:text-blue-300 transition ${activeTab === "calendar" ? "text-blue-400 font-bold" : ""
                }`}
            >
              Calendar
            </button>

            <button
              onClick={() => setActiveTab("create")}
              className={`px-2 py-1 rounded hover:text-blue-300 transition ${activeTab === "create" ? "text-blue-400 font-bold" : ""
                }`}
            >
              Create Event
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`px-2 py-1 rounded hover:text-blue-300 transition ${activeTab === "pending" ? "text-blue-400 font-bold" : ""
                }`}
            >
              Pending ({pendingEvents.length})
            </button>

            <button
              onClick={() => setActiveTab("approved")}
              className={`px-2 py-1 rounded hover:text-blue-300 transition ${activeTab === "approved" ? "text-blue-400 font-bold" : ""
                }`}
            >
              All Events ({approvedEvents.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("users");
                getAllUsers();
              }}
              className={`px-2 py-1 rounded hover:text-blue-300 transition ${activeTab === "users" ? "text-blue-400 font-bold" : ""
                }`}
            >
              Users
            </button>

            <button
              onClick={() => {
                setActiveTab("venues");
                loadVenues();
              }}
              className={`px-2 py-1 rounded hover:text-blue-300 transition ${activeTab === "venues" ? "text-blue-400 font-bold" : ""
                }`}
            >
              Venues
            </button>

            <button
              onClick={() => {
                handleNotifications();
                setActiveTab("notifications");
              }}
              className={`px-2 py-1 rounded hover:text-red-400 transition ${activeTab === "notifications" ? "text-red-400 font-bold" : ""
                }`}
            >
              Notifications
            </button>

            <button
              onClick={handleLogout}
              className="px-2 py-1 rounded hover:text-red-400 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>



      {/* Hero Section */}
      <section className="text-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 tracking-wide">
          Welcome, <span className="text-white">Admin</span>
        </h2>
        <p className="text-gray-400 mt-2 sm:mt-3 text-sm sm:text-base">
          {activeTab === "calendar" && "View all events in calendar view"}
          {activeTab === "create" && "Create and manage events"}
          {activeTab === "pending" &&
            "Review and approve events submitted by users"}
          {activeTab === "approved" && "Manage all published events"}
          {activeTab === "users" &&
            "Manage users, roles, and branches"}
          {activeTab === "venues" &&
            "Create and manage reusable venues"}
          {activeTab === "notifications" &&
            "View all your notifications"}
        </p>
      </section>


      <div className="px-4 sm:px-6 lg:px-10 pb-10">
        {/* Calendar */}
        {activeTab === "calendar" && (
          <section>
            <div className="max-w-2xl mx-auto">
              <EventCalendar
                events={approvedEvents}
                onDateClick={(date) =>
                  console.log("Selected date:", date)
                }
              />
            </div>
          </section>
        )}

        {/* Create Event */}
        {activeTab === "create" && (
          <section>
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 bg-gray-800/80 border border-gray-700 p-4 sm:p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">
                  {editEvent ? "Edit Event" : "Create New Event"}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-4">
                  Admin events are automatically approved and published.
                </p>
                <form
                  onSubmit={handleSaveEvent}
                  className="space-y-4"
                >
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

                  {/* Venue select + Others */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">
                      Venue
                    </label>
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
                      {venues.map((v) => (
                        <option key={v._id} value={v.name}>
                          {v.name}
                        </option>
                      ))}
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
                    {loadingVenues && (
                      <p className="text-xs text-gray-500">
                        Loading venues...
                      </p>
                    )}
                  </div>

                  <input
                    type="number"
                    placeholder="Expected Participants"
                    value={strength}
                    onChange={(e) =>
                      setStrength(e.target.value)
                    }
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
                    onChange={(e) =>
                      setShortDesc(e.target.value)
                    }
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
                    onChange={(e) =>
                      setLearning(e.target.value)
                    }
                    className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-24 resize-none focus:border-blue-500 focus:outline-none"
                  />

                  <div className="flex justify-end gap-4 mt-2">
                    {editEvent && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded transition font-semibold"
                    >
                      {editEvent
                        ? "Update Event"
                        : "Create / Publish Event"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* Pending Events */}
        {activeTab === "pending" && (
          <section>
            {/* Header */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-400">
                Pending Approval ({pendingEvents.length})
              </h3>
              <button
                onClick={getPendingEvents}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm"
              >
                Refresh
              </button>
            </div>


            {/* Empty state */}
            {pendingEvents.length === 0 ? (
              <div className="bg-gray-800/80 border border-gray-700 p-6 sm:p-8 rounded-2xl text-center">
                <p className="text-gray-400 text-sm sm:text-lg">
                  No pending events to review
                </p>
              </div>
            ) : (
              /* Cards grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                {pendingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="bg-gray-800/80 border-2 border-yellow-600 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-yellow-600/30 transition-all"
                  >
                    {/* Top row: title + status */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-white mb-1">
                          {event.name}
                        </h4>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Submitted by{" "}
                          <span className="text-blue-400">
                            {event.createdBy?.fullName || "Unknown"}
                          </span>
                        </p>
                        <p className="text-gray-400 text-[11px] sm:text-xs">
                          Email: {event.createdBy?.email || "NA"}
                        </p>
                      </div>
                      <span className="bg-yellow-600 text-white text-[11px] sm:text-xs px-3 py-1 rounded-full">
                        PENDING
                      </span>
                    </div>

                    {/* Basic details */}
                    <div className="space-y-1.5 mb-3 text-xs sm:text-sm text-gray-300">
                      <p>
                        <strong className="text-white">Date:</strong> {event.date}
                      </p>
                      <p>
                        <strong className="text-white">Venue:</strong> {event.venue}
                      </p>
                      <p className="font-semibold">
                        Fee: {' '}
                        {!event.registrationFee || event.registrationFee === 0 ? (
                          <span className="text-green-400">FREE</span>
                        ) : (
                          <span className="text-yellow-400">₹{event.registrationFee}</span>
                        )}
                      </p>
                      <p>
                        <strong className="text-white">Strength:</strong>{" "}
                        {event.strength}
                      </p>
                      <p>
                        <strong className="text-white">Short Desc:</strong>{" "}
                        {event.shortDesc}
                      </p>
                    </div>

                    {/* Toggle details */}
                    <button
                      onClick={() =>
                        setViewStates((prev) => ({
                          ...prev,
                          [event._id]: !prev[event._id],
                        }))
                      }
                      className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm mb-3 underline"
                    >
                      {viewStates[event._id] ? "Hide Full Details" : "Show Full Details"}
                    </button>

                    {/* Extra details */}
                    {viewStates[event._id] && (
                      <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg text-gray-300 text-[11px] sm:text-sm space-y-3 mb-3">
                        <div>
                          <strong className="text-white block">About Event</strong>
                          <p className="mt-1">{event.about}</p>
                        </div>
                        <div>
                          <strong className="text-white block">Learning Outcomes</strong>
                          <p className="mt-1">{event.learning}</p>
                        </div>
                        <div>
                          <strong className="text-white block">Submitted At</strong>
                          <p className="mt-1">
                            {event.createdAt
                              ? new Date(event.createdAt).toLocaleString()
                              : "-"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Approve / Reject buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <button
                        onClick={() => handleApprove(event._id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition font-semibold text-xs sm:text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(event._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition font-semibold text-xs sm:text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}


        {/* Approved Events */}
        {activeTab === "approved" && (
          <section className="space-y-8">
            {/* Upcoming */}
            <div>
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-bold text-green-400">
                  Upcoming Events ({upcomingEvents.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {/* NEW: Download All Events CSV */}
                  <button
                    onClick={handleDownloadAllEvents}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition text-sm flex items-center gap-2"
                  >
                    <span>📊</span>
                    <span className="hidden sm:inline">Download All Events</span>
                    <span className="sm:hidden">CSV</span>
                  </button>
                  <button
                    onClick={getApprovedEvents}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="bg-gray-800/80 border border-gray-700 p-6 sm:p-8 rounded-2xl text-center">
                  <p className="text-gray-400 text-sm sm:text-lg">
                    No approved events yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-gray-800/80 border border-green-600 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-green-600/20 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-base sm:text-lg font-semibold text-white">
                          {event.name}
                        </h4>
                        <span className="bg-green-600 text-white text-[11px] sm:text-xs px-2 py-1 rounded-full">
                          UPCOMING
                        </span>
                      </div>

                      <div className="space-y-1 mb-2 text-xs sm:text-sm text-gray-300">
                        <p>{event.date}</p>
                        <p>{event.venue}</p>
                        <p className="font-semibold">
                          Fee: {' '}
                          {!event.registrationFee || event.registrationFee === 0 ? (
                            <span className="text-green-400">FREE</span>
                          ) : (
                            <span className="text-yellow-400">₹{event.registrationFee}</span>
                          )}
                        </p>
                        <p>{event.strength} participants</p>
                        <p className="text-[11px] sm:text-xs text-gray-500">
                          Created by {event.createdBy?.fullName || "Unknown"}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setViewStates((prev) => ({
                            ...prev,
                            [event._id]: !prev[event._id],
                          }))
                        }
                        className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm underline mb-2"
                      >
                        {viewStates[event._id] ? "Hide Details" : "View Details"}
                      </button>

                      {viewStates[event._id] && (
                        <div className="mt-2 bg-gray-700/50 p-3 rounded-lg text-[11px] sm:text-sm text-gray-300 space-y-2">
                          <p>
                            <strong className="text-white">Short Desc:</strong>{" "}
                            {event.shortDesc}
                          </p>
                          <p>
                            <strong className="text-white">About:</strong>{" "}
                            {event.about}
                          </p>
                          <p>
                            <strong className="text-white">Learning:</strong>{" "}
                            {event.learning}
                          </p>
                          {event.approvedAt && (
                            <p className="text-[11px] sm:text-xs text-green-400">
                              Approved{" "}
                              {new Date(event.approvedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions + Attendance */}
                      <div className="flex flex-col gap-2 mt-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleEditClick(event)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded transition text-xs sm:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteApproved(event._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded transition text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                        <button
                          onClick={() => openAttendanceModal(event)}
                          className="self-start bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs px-3 py-1 rounded"
                        >
                          Registrations & Attendance
                        </button>
                        {event.registrationFee && event.registrationFee > 0 && (
                          <button
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem("token");
                                const response = await axios.get(
                                  `${base_url}events/${event._id}/payments`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );

                                const { payments, totalPayments, totalRevenue } = response.data;

                                alert(
                                  `Payment Summary for "${event.name}":\n\n` +
                                  `Total Payments: ${totalPayments}\n` +
                                  `Total Revenue: ₹${totalRevenue}\n\n` +
                                  `Check console for detailed payment list`
                                );

                                console.log("Detailed Payments:", payments);
                              } catch (err) {
                                console.error(err);
                                alert(
                                  err.response?.data?.message ||
                                  "Failed to fetch payment details"
                                );
                              }
                            }}
                            className="self-start bg-yellow-600 hover:bg-yellow-700 text-white text-[11px] sm:text-xs px-3 py-1 rounded"
                          >
                            💰 View Payments
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadEventUsers(event)}
                          className="self-start bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] sm:text-xs px-3 py-1 rounded flex items-center gap-1"
                        >
                          <span>📊</span>
                          <span>Download Event Users</span>
                        </button>
                      </div>
                      <div className="border-t border-gray-700 mt-6 pt-6">
                        <EmailButtons
                          eventId={event._id}
                          eventName={event.name}
                        />
                        {/* 
                        <CSVDownloadButtons
                          eventId={event._id}
                          eventName={event.name}
                          showEventSpecific={true}
                        /> */}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-4">
                Past Events ({pastEvents.length})
              </h3>
              {pastEvents.length === 0 ? (
                <p className="text-gray-400 text-sm sm:text-base">
                  No past events yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {pastEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-gray-800/80 border border-green-600 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-green-600/20 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-base sm:text-lg font-semibold text-white">
                          {event.name}
                        </h4>
                        <span className="bg-green-600 text-white text-[11px] sm:text-xs px-2 py-1 rounded-full">
                          PAST
                        </span>
                      </div>

                      <div className="space-y-1 mb-2 text-xs sm:text-sm text-gray-300">
                        <p>{event.date}</p>
                        <p>{event.venue}</p>
                        <p>Strength: {event.strength}</p>
                        <p className="font-semibold">
                          Fee: {' '}
                          {!event.registrationFee || event.registrationFee === 0 ? (
                            <span className="text-green-400">FREE</span>
                          ) : (
                            <span className="text-yellow-400">₹{event.registrationFee}</span>
                          )}
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-500">
                          Created by {event.createdBy?.fullName || "Unknown"}
                        </p>
                        <p className="text-[11px] sm:text-xs">
                          {event.shortDesc}
                        </p>
                      </div>

                      {/* Feedback input */}
                      <div className="mt-3">
                        <label className="block text-[11px] sm:text-xs text-gray-400 mb-1">
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
                          className="w-full p-2 rounded bg-gray-900 border border-gray-600 text-white text-[11px] sm:text-xs focus:border-blue-500 focus:outline-none"
                        />
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                          <button
                            onClick={() => submitFeedback(event._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs py-1.5 px-3 rounded transition"
                          >
                            Submit Feedback
                          </button>
                          <button
                            onClick={() => loadFeedbackForEvent(event._id)}
                            className="text-[11px] sm:text-xs text-blue-300 underline hover:text-blue-200"
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
                            <p className="text-[11px] sm:text-xs text-gray-400 mb-1">
                              Feedback from participants/admin:
                            </p>
                            {feedbackList[event._id].map((fb) => (
                              <div key={fb._id} className="mb-2">
                                <p className="text-[11px] sm:text-xs text-blue-300 font-semibold">
                                  {fb.userName || "User"}
                                </p>
                                <p className="text-[11px] sm:text-xs text-gray-200">
                                  {fb.feedback}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Actions */}
                      <div className="flex flex-col gap-2 mt-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleEditClick(event)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded transition text-xs sm:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteApproved(event._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded transition text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                        <button
                          onClick={() => openAttendanceModal(event)}
                          className="self-start bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs px-3 py-1 rounded"
                        >
                          Registrations & Attendance
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}


        {/* Users */}
        {activeTab === "users" && (
          <section className="space-y-6">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-400">
                All Users ({users.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* NEW: CSV Download Button */}
                <button
                  onClick={handleDownloadFilteredUsers}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition text-sm flex items-center gap-2"
                  title={selectedUserBranch ? `Download ${selectedUserBranch} users` : 'Download all users'}
                >
                  <span>📊</span>
                  <span className="hidden sm:inline">
                    {selectedUserBranch ? `Download ${selectedUserBranch} Users` : 'Download All Users'}
                  </span>
                  <span className="sm:hidden">CSV</span>
                </button>
                <button
                  onClick={getAllUsers}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm"
                >
                  Refresh
                </button>
              </div>
            </div>
            {loadingUsers ? (
              <p className="text-gray-400">Loading users...</p>
            ) : users.length === 0 ? (
              <div className="bg-gray-800/80 border border-gray-700 p-8 rounded-2xl text-center">
                <p className="text-gray-400 text-lg">
                  No users found
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-red-400 mb-3">
                    Admins ({adminUsers.length})
                  </h4>
                  {adminUsers.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No admins.
                    </p>
                  ) : (
                    <UserTable
                      rows={adminUsers}
                      onChangeRole={handleChangeRole}
                      onViewProfile={loadUserRegistrations}
                    />
                  )}
                </div>

                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-purple-400 mb-3">
                    Organizers ({organizerUsers.length})
                  </h4>
                  {organizerUsers.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No organizers.
                    </p>
                  ) : (
                    <UserTable
                      rows={organizerUsers}
                      onChangeRole={handleChangeRole}
                      onViewProfile={loadUserRegistrations}
                    />
                  )}
                </div>

                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-green-400 mb-3">
                    Users by Branch
                  </h4>

                  {userBranchNames.length === 0 ? (
                    <p className="text-xs sm:text-sm text-gray-500">No users.</p>
                  ) : (
                    <div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
                        <label className="text-xs sm:text-sm text-gray-300">
                          Select Branch
                        </label>
                        <select
                          value={selectedUserBranch}
                          onChange={(e) => setSelectedUserBranch(e.target.value)}
                          className="bg-gray-900 border border-gray-600 text-white text-xs sm:text-sm px-3 py-1.5 rounded focus:outline-none focus:border-blue-500 w-full sm:w-auto"
                        >
                          <option value="">-- Choose branch --</option>
                          {userBranchNames.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedUserBranch === "" ? (
                        <p className="text-xs sm:text-sm text-gray-500">
                          Please select a branch to view users.
                        </p>
                      ) : filteredUserUsers.length === 0 ? (
                        <p className="text-xs sm:text-sm text-gray-500">
                          No users found in {selectedUserBranch}.
                        </p>
                      ) : (
                        <UserTable
                          rows={filteredUserUsers}
                          onChangeRole={handleChangeRole}
                          onViewProfile={loadUserRegistrations}
                        />
                      )}
                    </div>
                  )}
                </div>

              </div>
            )}
          </section>
        )}

        {/* Venues */}
        {activeTab === "venues" && (
          <section>
            <div className="max-w-3xl mx-auto mb-8 bg-gray-800/80 border border-gray-700 p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">
                Create Venue
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");
                  if (!token) {
                    alert("Please login again");
                    return;
                  }
                  if (!venueName.trim()) {
                    alert("Venue name is required");
                    return;
                  }
                  axios
                    .post(
                      base_url + "venues",
                      {
                        name: venueName,
                        location: venueLocation,
                        capacity: venueCapacity,
                        notes: venueNotes,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    )
                    .then(() => {
                      alert("Venue created successfully");
                      setVenueName("");
                      setVenueLocation("");
                      setVenueCapacity("");
                      setVenueNotes("");
                      loadVenues();
                    })
                    .catch((err) => {
                      console.error(err);
                      alert(
                        err.response?.data?.message ||
                        "Failed to create venue"
                      );
                    });
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Venue Name"
                  value={venueName}
                  onChange={(e) =>
                    setVenueName(e.target.value)
                  }
                  className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Location / Address"
                  value={venueLocation}
                  onChange={(e) =>
                    setVenueLocation(e.target.value)
                  }
                  className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Capacity (optional)"
                  value={venueCapacity}
                  onChange={(e) =>
                    setVenueCapacity(e.target.value)
                  }
                  className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  placeholder="Notes (optional)"
                  value={venueNotes}
                  onChange={(e) =>
                    setVenueNotes(e.target.value)
                  }
                  className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-20 resize-none focus:border-blue-500 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
                  >
                    Save Venue
                  </button>
                </div>
              </form>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-400">
                  Saved Venues ({venues.length})
                </h3>
                <button
                  onClick={loadVenues}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Refresh
                </button>
              </div>

              {loadingVenues ? (
                <p className="text-gray-400 text-sm">
                  Loading venues...
                </p>
              ) : venues.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No venues created yet.
                </p>
              ) : (
                <div className="bg-gray-800/80 border border-gray-700 rounded-2xl overflow-x-auto">
                  <table className="min-w-full text-xs sm:text-sm">
                    <thead className="bg-gray-900/80">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-300">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-gray-300">
                          Location
                        </th>
                        <th className="px-4 py-2 text-left text-gray-300">
                          Capacity
                        </th>
                        <th className="px-4 py-2 text-left text-gray-300">
                          Created By
                        </th>
                        <th className="px-4 py-2 text-left text-gray-300">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {venues.map((v) => (
                        <tr
                          key={v._id}
                          className="border-t border-gray-700"
                        >
                          <td className="px-4 py-2 text-white">
                            {v.name}
                          </td>
                          <td className="px-4 py-2 text-gray-300">
                            {v.location || "-"}
                          </td>
                          <td className="px-4 py-2 text-gray-300">
                            {v.capacity || "-"}
                          </td>
                          <td className="px-4 py-2 text-gray-300">
                            {v.createdBy || "-"}
                          </td>
                          <td className="px-4 py-2 text-gray-400">
                            {v.createdAt
                              ? new Date(
                                v.createdAt
                              ).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <section className="space-y-4">
            {/* Header */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-400">
                Notifications ({notificationsData.length})
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={handleNotifications}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded transition text-xs sm:text-sm"
                >
                  Refresh
                </button>
                <button
                  onClick={handleMarkAllRead}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-3 sm:px-4 py-2 rounded transition text-[11px] sm:text-sm"
                >
                  Mark all as read
                </button>
              </div>
            </div>

            {/* Loading / error */}
            {loadingNotifications && (
              <p className="text-gray-400 text-sm">Loading notifications...</p>
            )}
            {notificationsError && (
              <p className="text-red-400 text-sm mb-2">{notificationsError}</p>
            )}

            {/* Empty state */}
            {notificationsData.length === 0 && !loadingNotifications ? (
              <div className="bg-gray-800/80 border border-gray-700 p-6 sm:p-8 rounded-2xl text-center">
                <p className="text-gray-400 text-sm sm:text-lg">
                  No notifications right now
                </p>
              </div>
            ) : (
              /* Cards grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {notificationsData.map((n) => (
                  <div
                    key={n._id}
                    className={`bg-gray-800/80 border-2 p-4 sm:p-6 rounded-2xl shadow-lg transition-all ${n.isRead
                      ? "border-gray-700 hover:shadow-gray-500/20"
                      : "border-blue-500 hover:shadow-blue-500/30"
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                      <div>
                        <h4 className="text-lg sm:text-xl font-semibold text-white mb-1">
                          {n.title}
                        </h4>
                        <p className="text-gray-300 text-xs sm:text-sm whitespace-pre-line">
                          {n.message}
                        </p>
                        
                      </div>
                      <span
                        className={`text-[11px] sm:text-xs px-3 py-1 rounded-full ${n.isRead ? "bg-gray-600 text-white" : "bg-blue-600 text-white"
                          }`}
                      >
                        {n.isRead ? "READ" : "NEW"}
                      </span>
                    </div>

                    <div className="mb-3 text-[11px] sm:text-xs text-gray-400">
                      {n.createdAt && (
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkOneRead(n._id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition font-semibold text-xs sm:text-sm"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>

      {/* User profile modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-400">
                User Profile & Registrations
              </h3>
              <button
                onClick={closeUserModal}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 space-y-1 text-sm text-gray-300">
              <p>
                <span className="font-semibold text-gray-200">
                  Name:
                </span>{" "}
                {selectedUser.fullName}
              </p>
              <p>
                <span className="font-semibold text-gray-200">
                  Email:
                </span>{" "}
                {selectedUser.email}
              </p>
              <p>
                <span className="font-semibold text-gray-200">
                  Role:
                </span>{" "}
                {selectedUser.role}
              </p>
              <p>
                <span className="font-semibold text-gray-200">
                  Branch / Roll:
                </span>{" "}
                {selectedUser.branch || "-"}{" "}
                {selectedUser.rollNumber || "-"}
              </p>
              <p>
                <span className="font-semibold text-gray-200">
                  Approved:
                </span>{" "}
                {selectedUser.approved ? "Yes" : "No"}
              </p>
            </div>
            <hr className="border-gray-700 mb-4" />
            <div>
              <h4 className="text-lg font-semibold text-green-400 mb-2">
                Registered Events
              </h4>
              {loadingUserRegistrations ? (
                <p className="text-sm text-gray-400">
                  Loading registrations...
                </p>
              ) : userRegistrations.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No registrations found for this user.
                </p>
              ) : (
                <div className="max-height-64 overflow-y-auto space-y-2">
                  {userRegistrations.map((ev) => (
                    <div
                      key={ev._id}
                      className="bg-gray-800/80 border border-gray-700 p-3 rounded-lg text-sm"
                    >
                      <p className="font-semibold text-white">
                        {ev.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {ev.date} · {ev.venue}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {ev.strength} participants
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
              {attendanceEvent.date} · {attendanceEvent.venue}
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
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] sm:text-xs text-left">
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
                        const eventDateObj = new Date(
                          attendanceEvent.date
                        );
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        eventDateObj.setHours(0, 0, 0, 0);
                        const canMarkAttendance =
                          eventDateObj <= today;
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
                              {r.attendanceStatus ===
                                "present" && (
                                  <span className="text-green-400 font-semibold">
                                    Present
                                  </span>
                                )}
                              {r.attendanceStatus === "absent" && (
                                <span className="text-red-400 font-semibold">
                                  Absent
                                </span>
                              )}
                              {r.attendanceStatus ===
                                "not_marked" && (
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
                                    markAttendance(
                                      r.userId,
                                      "present"
                                    )
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
                                    markAttendance(
                                      r.userId,
                                      "absent"
                                    )
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
              </div>
            )}
          </div>
        </div>
      )}
      <SponsorImageManager />
    </div>
  );
}

export default AdminDashboard;
