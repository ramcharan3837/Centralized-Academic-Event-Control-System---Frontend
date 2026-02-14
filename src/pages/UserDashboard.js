import axios from "axios";
import { useEffect, useState } from "react";
import { base_url } from "../components/baseUrl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalPopup from "../pages/ModalPopup";


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
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

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
        className={`aspect-square p-1 rounded text-[10px] sm:text-xs font-medium transition-all relative flex items-center justify-center
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
    <div className="bg-gray-800/90 border border-gray-700 rounded-xl shadow-lg p-3 w-full max-w-xs sm:max-w-sm">
      <div className="flex items-center justify-between mb-3">
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

      <div className="grid grid-cols-7 gap-[2px] sm:gap-1 mb-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] sm:text-xs font-semibold text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[2px] sm:gap-1 mb-3">
        {calendarDays.map((cell, idx) => cell)}
      </div>

      <div className="flex items-center justify-center gap-3 pt-2 border-top border-gray-700/50 text-[10px] sm:text-xs">
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
            <h5 className="text-[11px] sm:text-xs font-semibold text-gray-300">
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
            <p className="text-[11px] sm:text-xs text-gray-500 italic">
              No events
            </p>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedDayEvents.map((event) => (
                <div
                  key={event._id || event.id}
                  className="bg-gray-700/40 p-2 rounded text-[11px] sm:text-xs"
                >
                  <p className="text-white font-medium truncate">
                    {event.name}
                  </p>
                  <p className="text-gray-400 truncate">{event.venue}</p>
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

  const [date, setDate] = useState("");

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);

  const [recentlyRegistered, setRecentlyRegistered] = useState(null);
  const [viewStates, setViewStates] = useState({});

  const [showEventForm, setShowEventForm] = useState(false);

  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [feedbackList, setFeedbackList] = useState({});
  const [loadingFeedback, setLoadingFeedback] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Tabs and filters
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    date: "",
    name: "",
    venue: "",
  });

  // Confirmation modal
  const [confirmEvent, setConfirmEvent] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Event form states
  const [editEvent, setEditEvent] = useState(null);
  const [name, setName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [strength, setStrength] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [about, setAbout] = useState("");
  const [learning, setLearning] = useState("");

  const [useCustomVenue, setUseCustomVenue] = useState(false);

  const [notificationsData, setNotificationsData] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("events");
  // "events" | "registered" | "attended" | "notifications"

  // Modal Popup state
  const [modalConfig, setModalConfig] = useState({
    showPopup: false,
    type: 'info',
    message: '',
    buttons: []
  });

  const showModal = (type, message, buttons = []) => {
    setModalConfig({ showPopup: true, type, message, buttons });
  };

  const closeModal = () => {
    setModalConfig({ showPopup: false, type: 'info', message: '', buttons: [] });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const handleFreeEventRegistration = async (event) => {
    try {
      setPaymentLoading(true);
      setPaymentError('');

      const token = localStorage.getItem("token");
      if (!token) {
        showModal('warning', "Please login again", [{ text: 'OK', variant: 'primary', action: closeModal }]);
        return;
      }

      const response = await axios.post(
        `${base_url}events/${event._id || event.id}/register-free`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'Success') {
        updateRegisteredLocal(event);
        setShowConfirm(false);
        setConfirmEvent(null);
        fetchAttendedEventsFromBackend();
      }
    } catch (err) {
      console.error("Error registering for free event", err);
      const msg = err.response?.data?.message || "Failed to register";
      showModal('info', msg, [{ text: 'OK', variant: 'primary', action: closeModal }]);
    } finally {
      setPaymentLoading(false);
    }
  };
  const handlePaidEventRegistration = async (event) => {
    try {
      setPaymentLoading(true);
      setPaymentError('');

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showModal('error', 'Failed to load payment gateway. Please try again.', [{ text: 'OK', variant: 'primary', action: closeModal }]);
        setPaymentLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        showModal('warning', "Please login again", [{ text: 'OK', variant: 'primary', action: closeModal }]);
        return;
      }

      // Get user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      // Step 1: Create order
      const orderResponse = await axios.post(
        `${base_url}payment/create-order`,
        {
          amount: event.registrationFee,
          eventId: event._id || event.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order, key } = orderResponse.data;

      // Step 2: Configure Razorpay
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'College Event Registration',
        description: `Registration for ${event.name}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            const verifyResponse = await axios.post(
              `${base_url}payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                eventId: event._id || event.id,
                amount: event.registrationFee,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyResponse.data.status === 'Success') {
              showModal('success', 'Payment successful! You are now registered.', [{ text: 'OK', variant: 'primary', action: closeModal }]);
              updateRegisteredLocal(event);
              setShowConfirm(false);
              setConfirmEvent(null);
              fetchAttendedEventsFromBackend();
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            showModal('error', 'Payment verification failed. Please contact support with payment ID: ' + response.razorpay_payment_id, [{ text: 'OK', variant: 'primary', action: closeModal }]);
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: userData.fullName || '',
          email: userData.email || '',
          contact: userData.phone || '',
        },
        notes: {
          eventId: event._id || event.id,
          eventName: event.name,
        },
        theme: {
          color: '#1976d2',
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
            setPaymentError('Payment cancelled');
            setShowConfirm(false);
            setConfirmEvent(null);
          },
        },
      };

      // Step 4: Open Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      showModal('error', error.response?.data?.message || 'Failed to process payment', [{ text: 'OK', variant: 'primary', action: closeModal }]);
      setPaymentLoading(false);
    }
  };
  const confirmRegistration = async () => {
    if (!confirmEvent) return;

    // Check if event is free or paid
    const isFreeEvent = !confirmEvent.registrationFee || confirmEvent.registrationFee === 0;

    if (isFreeEvent) {
      // Handle free event registration
      await handleFreeEventRegistration(confirmEvent);
    } else {
      // Handle paid event registration with Razorpay
      await handlePaidEventRegistration(confirmEvent);
    }
  };

  useEffect(() => {
    getAllVenues();
  }, []);

  const [venues, setVenues] = useState([]);
  const getAllVenues = () => {
    axios.get(base_url + "venues").then((res) => {
      setVenues(res.data.venues);
    });
  };

  const handleNotifications = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showModal('warning', "Please login again", [{ text: 'OK', variant: 'primary', action: closeModal }]);
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
        showModal('error', err.response?.data?.message || "Failed to load notifications", [{ text: 'OK', variant: 'primary', action: closeModal }]);
      })
      .finally(() => setLoadingNotifications(false));
  };

  const handleMarkOneRead = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showModal('warning', "Please login again", [{ text: 'OK', variant: 'primary', action: closeModal }]);
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
        showModal('error', err.response?.data?.message || "Failed to update notification", [{ text: 'OK', variant: 'primary', action: closeModal }]);
      });
  };

  const handleMarkAllRead = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showModal('warning', "Please login again", [{ text: 'OK', variant: 'primary', action: closeModal }]);
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
        showModal('error', err.response?.data?.message ||
          "Failed to update notifications", [{ text: 'OK', variant: 'primary', action: closeModal }]);
      });
  };

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    getAllEvents();
    fetchRegisteredEventsFromBackend();
    fetchAttendedEventsFromBackend();
  }, []);

  // ====== FEEDBACK LOGIC ======
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

  const submitFeedback = async (eventId) => {
    const text = feedbackInputs[eventId]?.trim();

    if (!text) {
      showModal('warning', "Please enter feedback", [{ text: 'OK', variant: 'primary', action: closeModal }]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showModal('warning', "Please login again", [{ text: 'OK', variant: 'primary', action: closeModal }]);
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
      showModal('info', msg, [{ text: 'OK', variant: 'primary', action: closeModal }]);
    }
  };

  // ====== BACKEND FETCHES ======
  const fetchRegisteredEventsFromBackend = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();
      if (!token || !userId) return;

      const res = await axios.get(
        `${base_url}users/${userId}/registrations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRegisteredEvents(res.data.events || []);
    } catch (err) {
      console.error("Error fetching registered events", err);
    }
  };

  const fetchAttendedEventsFromBackend = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();
      if (!token || !userId) return;

      const res = await axios.get(
        `${base_url}users/${userId}/attended`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAttendedEvents(res.data.events || []);
    } catch (err) {
      console.error("Error fetching attended events", err);
    }
  };

  const getAllEvents = () => {
    axios
      .get(base_url + "events")
      .then((res) => {
        const allEvents = res?.data?.events || res.data || [];
        setEventsData(allEvents);

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

  // ====== EVENT CREATE / EDIT ======
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
      showModal('warning', "Please fill all fields", [{ text: 'OK', variant: 'primary', action: closeModal }]);
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
    };

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (editEvent) {
      axios
        .put(base_url + `events/${editEvent.id}`, eventData, config)
        .then(() => {
          showModal('success', "Event updated and submitted for re-approval!", [{ text: 'OK', variant: 'primary', action: closeModal }]);
          resetForm();
          getAllEvents();
        })
        .catch((err) => {
          console.log(err);
          showModal('error', err.response?.data?.message || "Failed to update event", [{ text: 'OK', variant: 'primary', action: closeModal }]);
        });
    } else {
      axios
        .post(base_url + "events", eventData, config)
        .then(() => {
          showModal('info', "Event submitted for admin approval!", [{ text: 'OK', variant: 'primary', action: closeModal }]);
          resetForm();
          getAllEvents();
        })
        .catch((err) => {
          console.log(err);
          showModal('error', err.response?.data?.message || "Failed to create event", [{ text: 'OK', variant: 'primary', action: closeModal }]);
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

  // ====== REGISTRATION FLOW ======
  const isEventFilled = (event) => {
    const max = parseInt(event.strength || 0, 10);
    const current = parseInt(event.currentRegistrations || 0, 10);
    return max > 0 && current >= max;
  };

  const updateRegisteredLocal = (event) => {
    const already = registeredEvents.find(
      (e) => (e.id || e._id) === (event.id || event._id)
    );

    if (!already) {
      setRegisteredEvents([...registeredEvents, event]);
      setRecentlyRegistered(event);
    } else {
      setRecentlyRegistered({ ...event, already: true });
    }

    setUpcomingEvents((prev) =>
      prev.map((e) =>
        (e.id || e._id) === (event.id || event._id)
          ? {
            ...e,
            currentRegistrations: (e.currentRegistrations || 0) + 1,
          }
          : e
      )
    );
  };

  const handleRegisterClick = (event) => {
    setConfirmEvent(event);
    setShowConfirm(true);
  };

  // const confirmRegistration = async () => {
  //   if (!confirmEvent) return;

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       showModal('warning', "Please login again", [{ text: 'OK', variant: 'primary', action: closeModal }]);
  //       return;
  //     }

  //     await axios.post(
  //       `${base_url}events/${confirmEvent.id || confirmEvent._id}/register`,
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     updateRegisteredLocal(confirmEvent);
  //     setShowConfirm(false);
  //     setConfirmEvent(null);

  //     fetchAttendedEventsFromBackend();
  //   } catch (err) {
  //     console.error("Error registering for event", err);
  //     const msg =
  //       err.response?.data?.message || "Failed to register";
  //     showModal('info', msg, [{ text: 'OK', variant: 'primary', action: closeModal }]);
  //     setShowConfirm(false);
  //     setConfirmEvent(null);
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // ====== FILTER HELPERS ======
  const filteredUpcomingEvents = date
    ? upcomingEvents.filter((event) => event.date === date)
    : upcomingEvents;

  const applyFilters = (list) => {
    return list.filter((ev) => {
      const dateStr = ev.date ? ev.date.split("T")[0] : "";

      const matchesDate = filters.date ? dateStr === filters.date : true;

      const matchesName = filters.name
        ? ev.name?.toLowerCase().includes(filters.name.toLowerCase())
        : true;

      const matchesVenue = filters.venue
        ? ev.venue
          ?.toLowerCase()
          .includes(filters.venue.toLowerCase())
        : true;

      return matchesDate && matchesName && matchesVenue;
    });
  };

  // ====== RENDER ======
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
      <nav className="bg-gray-950/80 backdrop-blur-md text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">
            Event Coordination Engine
          </h1>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:space-x-5 lg:space-x-8 text-sm lg:text-lg">


            <button
              onClick={() => setActiveTab("calendar")}
              className={`transition ${activeTab === "calendar" ? "text-blue-300 underline" : "hover:text-blue-300"}`}
            >
              Calendar
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`transition ${activeTab === "all"
                ? "text-blue-300 underline"
                : "hover:text-blue-300"
                }`}
            >
              All Events
            </button>

            <button
              onClick={() => setActiveTab("registered")}
              className={`transition ${activeTab === "registered"
                ? "text-blue-300 underline"
                : "hover:text-blue-300"
                }`}
            >
              Registered Events
            </button>

            <button
              onClick={() => setActiveTab("attended")}
              className={`transition ${activeTab === "attended"
                ? "text-blue-300 underline"
                : "hover:text-blue-300"
                }`}
            >
              Attended Events
            </button>

            <button
              onClick={() => {
                handleNotifications();
                setActiveTab("notifications");
              }}
              className="hover:text-red-400 transition"
            >
              Notifications
            </button>

            <button
              onClick={() => setShowEventForm(!showEventForm)}
              className="hover:text-green-300 transition whitespace-nowrap"
            >
              {showEventForm ? "Hide Form" : "Create Event"}
            </button>

            <button
              onClick={handleLogout}
              className="hover:text-blue-400 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 border-t border-gray-800 pt-2">
            <div className="flex flex-col space-y-1 text-sm">
              <a
                href="/home"
                className="px-3 py-2 rounded hover:bg-gray-800"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </a>
              <button
                onClick={() => { setActiveTab("calendar"); setMobileOpen(false); }}
                className={`text-left px-3 py-2 rounded ${activeTab === "calendar" ? "bg-blue-700 text-white" : "hover:bg-gray-800"}`}
              >
                Calendar
              </button>

              <button
                onClick={() => {
                  setActiveTab("all");
                  setMobileOpen(false);
                }}
                className={`text-left px-3 py-2 rounded ${activeTab === "all"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-800"
                  }`}
              >
                Browse Events
              </button>

              <button
                onClick={() => {
                  setActiveTab("registered");
                  setMobileOpen(false);
                }}
                className={`text-left px-3 py-2 rounded ${activeTab === "registered"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-800"
                  }`}
              >
                Registered Events
              </button>

              <button
                onClick={() => {
                  setActiveTab("attended");
                  setMobileOpen(false);
                }}
                className={`text-left px-3 py-2 rounded ${activeTab === "attended"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-gray-800"
                  }`}
              >
                Attended Events
              </button>

              <button
                onClick={() => {
                  handleNotifications();
                  setActiveTab("notifications");
                  setMobileOpen(false);
                }}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 text-red-300"
              >
                Notifications
              </button>

              <button
                onClick={() => {
                  setShowEventForm(!showEventForm);
                  setMobileOpen(false);
                }}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 text-green-300"
              >
                {showEventForm ? "Hide Form" : "Create Event"}
              </button>

              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 text-blue-300"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>


      {/* Layout */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-10 flex flex-col lg:flex-row gap-6 lg:gap-8">


        {/* Right: Content */}
        <div className="flex-1">
          {/* Recently registered banner */}
          {recentlyRegistered && (
            <div
              className={`bg-gray-800/90 border ${recentlyRegistered.already
                ? "border-yellow-500"
                : "border-green-500"
                } p-4 sm:p-6 rounded-2xl shadow-lg mb-4`}
            >
              <p className="text-sm sm:text-base md:text-lg font-semibold mb-3">
                {recentlyRegistered.already
                  ? "You already registered for"
                  : "Successfully registered for"}{" "}
                <span className="text-blue-300">
                  {recentlyRegistered.name}
                </span>
              </p>

              <button
                onClick={() => setRecentlyRegistered(null)}
                className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-4 rounded transition text-sm"
              >
                Close
              </button>
            </div>
          )}

          {/* Hero */}
          {/* Hero section - ONLY for All Events tab */}
          {activeTab === "all" && (
            <section className="text-center py-6 sm:py-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 tracking-wide">
                Welcome, <span className="text-white">{/* user name */}</span>
              </h2>
              <p className="text-gray-400 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
                Discover and register for exciting upcoming events
              </p>
              <button onClick={() => document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-5 sm:mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg transition text-sm sm:text-base">
                Browse Events
              </button>
            </section>
          )}


          {/* Create / Edit Event form */}
          {showEventForm && (
            <section>
              <div className="mb-6 bg-gray-800/80 border border-gray-700 p-4 sm:p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-400">
                    {editEvent ? "Edit Event" : "Create Event"}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-red-400 hover:text-red-500 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg mb-4">
                  <p className="text-blue-300 text-xs sm:text-sm">
                    Your event will be submitted for admin approval before
                    it appears publicly.
                  </p>
                </div>

                <form
                  onSubmit={handleSaveEvent}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Event Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                  />
                  <DatePicker
                    selected={eventDate ? new Date(eventDate) : null}
                    onChange={(d) => setEventDate(d ? d.toISOString().split("T")[0] : "")}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select event date"
                    className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
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
                    className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                  >
                    <option value="">Select a venue</option>
                    {venues?.map((v, id) => (
                      <option key={id} value={v?.name}>
                        {v?.name}
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
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                    />
                  )}
                  <input
                    type="number"
                    placeholder="Expected Participants"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                  />
                  <textarea
                    placeholder="Short Description"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-20 resize-none focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                  />
                  <textarea
                    placeholder="About Event"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-24 resize-none focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                  />
                  <textarea
                    placeholder="Learning Outcomes"
                    value={learning}
                    onChange={(e) => setLearning(e.target.value)}
                    className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white h-24 resize-none focus:border-blue-500 focus:outline-none text-sm sm:text-base"
                  />

                  <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-600 hover:bg-gray-700 px-5 sm:px-6 py-2 rounded transition text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 px-5 sm:px-6 py-2 rounded transition text-sm sm:text-base"
                    >
                      {editEvent
                        ? "Update Event"
                        : "Submit Event"}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}
          {/* Calendar Section - separate tab like Admin */}
          {activeTab === "calendar" && (
            <section className="mb-12 py-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 text-center mb-8 md:mb-12 tracking-wide">
                Event Calendar
              </h3>
              <div className="flex justify-center">
                <CompactEventCalendar events={eventsData} />
              </div>
            </section>
          )}

          {/* Filters + Tabs */}
          {activeTab !== "calendar" && (
            <section className="pb-12">

              <div className="flex flex-col md:flex-row gap-10 relative">
                {/* Top-right date filter */}
                {/* <div className="md:absolute right-0 top-0 flex flex-col items-end md:items-end mb-4 md:mb-0">
                <label className="text-blue-400 text-xs sm:text-sm mb-1 font-semibold">
                  Browse by Date
                </label>
                <DatePicker
                  selected={date ? new Date(date) : null}
                  onChange={(d) => setDate(d ? d.toISOString().split("T")[0] : "")}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date"
                  className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />

                <button
                  onClick={() => setDate("")}
                  className="text-red-400 text-xs mt-2 underline hover:text-red-500"
                >
                  Clear Filter
                </button>
              </div> */}

                {/* Main filters + content */}
                <div className="flex-1 mt-6 md:mt-10">
                  {/* Extra filters */}
                  <div className="mb-8 flex flex-wrap gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Filter by Date
                      </label>
                      <DatePicker
                        selected={filters.date ? new Date(filters.date) : null}
                        onChange={(d) =>
                          setFilters((f) => ({
                            ...f,
                            date: d ? d.toISOString().split("T")[0] : "",
                          }))
                        }
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select date"
                        className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />

                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Filter by Name
                      </label>
                      <input
                        type="text"
                        placeholder="Event name"
                        value={filters.name}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            name: e.target.value,
                          }))
                        }
                        className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Filter by Venue
                      </label>
                      <input
                        type="text"
                        placeholder="Venue"
                        value={filters.venue}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            venue: e.target.value,
                          }))
                        }
                        className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {(filters.date ||
                      filters.name ||
                      filters.venue) && (
                        <button
                          onClick={() =>
                            setFilters({
                              date: "",
                              name: "",
                              venue: "",
                            })
                          }
                          className="self-end text-xs text-red-400 underline hover:text-red-500"
                        >
                          Clear All Filters
                        </button>
                      )}
                  </div>

                  {/* ===== TAB CONTENT ===== */}

                  {/* All tab */}
                  {activeTab === "all" && (
                    <>
                      {/* Upcoming */}
                      <section id="browse" className="mb-12">
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">
                          Upcoming Events
                        </h3>

                        {applyFilters(filteredUpcomingEvents).length ===
                          0 ? (
                          <p className="text-gray-400 text-sm sm:text-base">
                            No upcoming events for this selection.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {applyFilters(
                              filteredUpcomingEvents
                            ).map((event) => (
                              <div
                                key={event.id || event._id}
                                className="bg-gray-800/80 border border-gray-700 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-blue-400/20 transition-all"
                              >
                                <h4 className="text-lg font-semibold text-white mb-2">
                                  {event.name}
                                </h4>
                                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                  {event.date}
                                </p>
                                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                  {event.venue}
                                </p>
                                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                  {event.shortDesc}
                                </p>
                                <p className="text-gray-400 text-xs mb-1">
                                  {event.currentRegistrations || 0} /{" "}
                                  {event.strength || 0} registered
                                </p>

                                <div className="flex flex-wrap gap-2 mt-3">
                                  {isEventFilled(event) ? (
                                    <button
                                      disabled
                                      className="bg-gray-600 text-gray-300 cursor-not-allowed py-2 px-4 rounded text-sm"
                                    >
                                      Registrations Filled
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleRegisterClick(event)
                                      }
                                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition text-sm"
                                    >
                                      Register
                                    </button>
                                  )}

                                  <button
                                    onClick={() =>
                                      setViewStates((prev) => ({
                                        ...prev,
                                        [event.id || event._id]:
                                          !prev[
                                          event.id || event._id
                                          ],
                                      }))
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition text-sm"
                                  >
                                    {viewStates[event.id || event._id]
                                      ? "Hide Details"
                                      : "View"}
                                  </button>
                                </div>

                                {viewStates[event.id || event._id] && (
                                  <div className="mt-4 bg-gray-700/50 p-3 rounded-lg text-gray-300 text-xs sm:text-sm space-y-2">
                                    <p>
                                      <strong>About Event</strong>{" "}
                                      {event.about}
                                    </p>
                                    <p>
                                      <strong>
                                        Learning Outcomes
                                      </strong>{" "}
                                      {event.learning}
                                    </p>
                                    <p>
                                      <strong>Strength</strong>{" "}
                                      {event.strength}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </section>

                      {/* Past + Feedback */}
                      <section id="past-events" className="mb-12">
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">
                          Past Events
                        </h3>

                        {pastEvents.length === 0 ? (
                          <p className="text-gray-400 text-sm sm:text-base">
                            No past events yet.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {applyFilters(pastEvents).map((event) => (
                              <div
                                key={event.id || event._id}
                                className="bg-gray-800/80 border border-gray-700 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-gray-500/30 transition-all"
                              >
                                <h4 className="text-lg font-semibold text-white mb-2">
                                  {event.name}
                                </h4>
                                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                  {event.date}
                                </p>
                                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                  {event.venue}
                                </p>
                                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                  Strength: {event.strength}
                                </p>
                                <p className="text-gray-400 text-xs sm:text-sm mb-2">
                                  {event.shortDesc}
                                </p>

                                {/* Feedback input */}
                                <div className="mt-3">
                                  <label className="block text-xs text-gray-400 mb-1">
                                    Your Feedback
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder="Share your experience about this event"
                                    value={
                                      feedbackInputs[
                                      event.id || event._id
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      setFeedbackInputs((prev) => ({
                                        ...prev,
                                        [event.id || event._id]:
                                          e.target.value,
                                      }))
                                    }
                                    className="w-full p-2 rounded bg-gray-900 border border-gray-600 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                                  />

                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                                    <button
                                      onClick={() =>
                                        submitFeedback(
                                          event.id || event._id
                                        )
                                      }
                                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1.5 px-3 rounded transition"
                                    >
                                      Submit Feedback
                                    </button>

                                    <button
                                      onClick={() =>
                                        loadFeedbackForEvent(
                                          event.id || event._id
                                        )
                                      }
                                      className="text-xs text-blue-300 underline hover:text-blue-200"
                                    >
                                      {loadingFeedback[
                                        event.id || event._id
                                      ]
                                        ? "Loading..."
                                        : "View Feedbacks"}
                                    </button>
                                  </div>

                                  {/* Feedback list */}
                                  {feedbackList[event.id || event._id] &&
                                    feedbackList[event.id || event._id]
                                      .length > 0 && (
                                      <div className="mt-3 border-t border-gray-700 pt-2 max-h-32 overflow-y-auto">
                                        <p className="text-xs text-gray-400 mb-1">
                                          Feedback from participants
                                        </p>

                                        {feedbackList[
                                          event.id || event._id
                                        ].map((fb) => (
                                          <div
                                            key={fb._id}
                                            className="mb-2"
                                          >
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
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    </>
                  )}

                  {/* Registered tab */}
                  {activeTab === "registered" && (
                    <section id="registered" className="mb-12">
                      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">
                        My Registered Events
                      </h3>

                      {applyFilters(registeredEvents).length === 0 ? (
                        <p className="text-gray-400 text-sm sm:text-base">
                          You have not registered for any events yet.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                          {applyFilters(registeredEvents).map((event) => (
                            <div
                              key={event._id || event.id}
                              className="bg-gray-800/80 border border-gray-700 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-blue-400/20 transition-all"
                            >
                              <h4 className="text-lg font-semibold text-white mb-2">
                                {event.name}
                              </h4>
                              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                {event.date}
                              </p>
                              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                {event.venue}
                              </p>
                              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                {event.shortDesc}
                              </p>
                              <p className="text-xs text-green-400 font-semibold">
                                ✅ You are registered for this event
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}

                  {/* Attended tab */}
                  {activeTab === "attended" && (
                    <section className="mb-12">
                      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">
                        Attended Events
                      </h3>

                      {applyFilters(attendedEvents).length === 0 ? (
                        <p className="text-gray-400 text-sm sm:text-base">
                          You have not attended any events yet.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                          {applyFilters(attendedEvents).map((event) => (
                            <div
                              key={event._id || event.id}
                              className="bg-gray-800/80 border border-gray-700 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-gray-500/30 transition-all"
                            >
                              <h4 className="text-lg font-semibold text-white mb-2">
                                {event.name}
                              </h4>
                              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                {event.date}
                              </p>
                              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                {event.venue}
                              </p>
                              <p className="text-gray-400 text-xs sm:text-sm mb-1">
                                Strength: {event.strength}
                              </p>
                              <p className="text-gray-400 text-xs sm:text-sm mb-2">
                                {event.shortDesc}
                              </p>
                              <p className="text-xs text-green-400 font-semibold">
                                ✅ Marked as attended (past event)
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}

                  {/* Notifications */}
                  {activeTab === "notifications" && (
                    <section>
                      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-blue-400">
                          Notifications ({notificationsData.length})
                        </h3>
                        <div className="flex gap-2 sm:gap-3">
                          <button
                            onClick={handleNotifications}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded transition text-sm"
                          >
                            🔄 Refresh
                          </button>
                          <button
                            onClick={handleMarkAllRead}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-3 sm:px-4 py-2 rounded transition text-xs sm:text-sm"
                          >
                            Mark all as read
                          </button>
                        </div>
                      </div>

                      {loadingNotifications && (
                        <p className="text-gray-400 mb-4">
                          Loading notifications...
                        </p>
                      )}
                      {notificationsError && (
                        <p className="text-red-400 mb-4">
                          {notificationsError}
                        </p>
                      )}

                      {notificationsData.length === 0 ? (
                        <div className="bg-gray-800/80 border border-gray-700 p-6 sm:p-8 rounded-2xl text-center">
                          <p className="text-gray-400 text-sm sm:text-lg">
                            ✅ No notifications right now
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                    {new Date(
                                      n.createdAt
                                    ).toLocaleString()}
                                  </span>
                                )}
                              </div>

                              <div className="flex gap-3">
                                {!n.isRead && (
                                  <button
                                    onClick={() =>
                                      handleMarkOneRead(n._id)
                                    }
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition font-semibold text-xs sm:text-sm"
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
                  )}
                </div>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && confirmEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-3">
          <div className="bg-gray-900 border border-gray-700 p-5 sm:p-6 rounded-2xl max-w-lg w-full">
            <h3 className="text-lg sm:text-xl font-bold text-blue-400 mb-3">
              Confirm Registration
            </h3>

            <p className="mb-2 text-sm sm:text-base">
              Are you sure you want to register for{" "}
              <span className="font-semibold">
                {confirmEvent.name}
              </span>
              ?
            </p>

            <p className="text-gray-300 mb-1 text-sm">
              <strong>Date:</strong> {confirmEvent.date}
            </p>
            <p className="text-gray-300 mb-1 text-sm">
              <strong>Venue:</strong> {confirmEvent.venue}
            </p>

            {/* ADD THIS: Show Registration Fee */}
            <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg my-3">
              <p className="text-white font-semibold text-base">
                Registration Fee: {' '}
                {!confirmEvent.registrationFee || confirmEvent.registrationFee === 0
                  ? <span className="text-green-400">FREE</span>
                  : <span className="text-yellow-400">₹{confirmEvent.registrationFee}</span>
                }
              </p>
            </div>

            <p className="text-gray-300 mb-2 text-sm">
              {confirmEvent.shortDesc}
            </p>

            {confirmEvent.about && (
              <p className="text-gray-300 text-xs sm:text-sm mb-1">
                <strong>About:</strong> {confirmEvent.about}
              </p>
            )}

            {confirmEvent.learning && (
              <p className="text-gray-300 text-xs sm:text-sm mb-1">
                <strong>Learning Outcomes:</strong>{" "}
                {confirmEvent.learning}
              </p>
            )}

            {confirmEvent.strength && (
              <p className="text-gray-300 text-xs sm:text-sm mb-3">
                <strong>Strength:</strong> {confirmEvent.strength}
              </p>
            )}

            {/* ADD THIS: Show Payment Error */}
            {paymentError && (
              <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg my-3">
                <p className="text-red-300 text-sm">{paymentError}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmEvent(null);
                  setPaymentError('');
                }}
                disabled={paymentLoading}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                onClick={confirmRegistration}
                disabled={paymentLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {!confirmEvent.registrationFee || confirmEvent.registrationFee === 0
                      ? 'Register for Free'
                      : `Pay ₹${confirmEvent.registrationFee} & Register`
                    }
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ModalPopup 
        showPopup={modalConfig.showPopup}
        type={modalConfig.type}
        message={modalConfig.message}
        buttons={modalConfig.buttons}
      />
    </div>
  );
}

export default UserDashboard;