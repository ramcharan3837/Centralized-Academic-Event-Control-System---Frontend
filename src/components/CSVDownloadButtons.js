// ========================================
// CSVDownloadButtons.js - UPDATED WITH FILTERS
// Place in src/components/ folder
// ========================================

import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from './baseUrl';

const CSVDownloadButtons = ({ 
  eventId, 
  eventName, 
  showEventSpecific = false,
  // NEW: Filter props
  filteredUsers = null,  // Pass filtered user array from parent
  filteredEvents = null, // Pass filtered event array from parent
  allUsers = null,       // Pass all users array from parent
  allEvents = null       // Pass all events array from parent
}) => {
  const [loading, setLoading] = useState(false);

  // Helper function to convert array to CSV
  const convertToCSV = (data, headers) => {
    if (!data || data.length === 0) return '';

    const headerRow = headers.map(h => h.title).join(',');
    const rows = data.map(row => {
      return headers.map(h => {
        const value = row[h.id] || '';
        // Escape commas and quotes in values
        const escapedValue = String(value).replace(/"/g, '""');
        return `"${escapedValue}"`;
      }).join(',');
    });

    return [headerRow, ...rows].join('\n');
  };

  // Helper function to download CSV
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

  const handleDownloadAllUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      // Check if filtered users are provided from parent
      if (filteredUsers && filteredUsers.length > 0) {
        // Download filtered users (client-side)
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

        const userData = filteredUsers.map(user => ({
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
        downloadCSV(csvContent, `filtered-users-${Date.now()}.csv`);
        alert(`CSV file downloaded successfully! (${filteredUsers.length} users)`);
        
      } else if (allUsers && allUsers.length > 0) {
        // Download all users (client-side)
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

        const userData = allUsers.map(user => ({
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
        alert(`CSV file downloaded successfully! (${allUsers.length} users)`);
        
      } else {
        // Fetch from server if no data provided
        const response = await axios.get(`${base_url}download-users-csv`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `all-users-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        alert('CSV file downloaded successfully!');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEventUsers = async () => {
    if (!eventId) {
      alert('Please select an event first.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.get(`${base_url}download-event-users-csv/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${eventName || 'event'}-users-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert('CSV file downloaded successfully!');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAllEvents = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      // Check if filtered events are provided from parent
      if (filteredEvents && filteredEvents.length > 0) {
        // Download filtered events (client-side with registration counts)
        const headers = [
          { id: 'id', title: 'Event ID' },
          { id: 'name', title: 'Event Name' },
          { id: 'date', title: 'Date' },
          { id: 'venue', title: 'Venue' },
          { id: 'strength', title: 'Capacity' },
          { id: 'shortDesc', title: 'Description' },
          { id: 'approved', title: 'Approved' },
          { id: 'createdBy', title: 'Created By' },
          { id: 'createdAt', title: 'Created At' }
        ];

        const eventData = filteredEvents.map(event => ({
          id: event._id || '',
          name: event.name || '',
          date: event.date || '',
          venue: event.venue || '',
          strength: event.strength || 0,
          shortDesc: event.shortDesc || '',
          approved: event.approved ? 'Yes' : 'No',
          createdBy: event.createdBy?.fullName || event.createdBy?.email || '',
          createdAt: event.createdAt ? new Date(event.createdAt).toLocaleDateString() : ''
        }));

        const csvContent = convertToCSV(eventData, headers);
        downloadCSV(csvContent, `filtered-events-${Date.now()}.csv`);
        alert(`CSV file downloaded successfully! (${filteredEvents.length} events)`);
        
      } else if (allEvents && allEvents.length > 0) {
        // Download all events (client-side)
        const headers = [
          { id: 'id', title: 'Event ID' },
          { id: 'name', title: 'Event Name' },
          { id: 'date', title: 'Date' },
          { id: 'venue', title: 'Venue' },
          { id: 'strength', title: 'Capacity' },
          { id: 'shortDesc', title: 'Description' },
          { id: 'approved', title: 'Approved' },
          { id: 'createdBy', title: 'Created By' },
          { id: 'createdAt', title: 'Created At' }
        ];

        const eventData = allEvents.map(event => ({
          id: event._id || '',
          name: event.name || '',
          date: event.date || '',
          venue: event.venue || '',
          strength: event.strength || 0,
          shortDesc: event.shortDesc || '',
          approved: event.approved ? 'Yes' : 'No',
          createdBy: event.createdBy?.fullName || event.createdBy?.email || '',
          createdAt: event.createdAt ? new Date(event.createdAt).toLocaleDateString() : ''
        }));

        const csvContent = convertToCSV(eventData, headers);
        downloadCSV(csvContent, `all-events-${Date.now()}.csv`);
        alert(`CSV file downloaded successfully! (${allEvents.length} events)`);
        
      } else {
        // Fetch from server if no data provided
        const response = await axios.get(`${base_url}download-events-csv`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `all-events-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        alert('CSV file downloaded successfully!');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csv-download-section">
      <div className="flex flex-wrap gap-3">
        {/* Download All/Filtered Users Button */}
        <button
          onClick={handleDownloadAllUsers}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>📊</span>
          <span>
            {filteredUsers && filteredUsers.length > 0 
              ? `Download Filtered Users (${filteredUsers.length})`
              : 'Download All Users'
            }
          </span>
        </button>

        {/* Download Event-Specific Users Button */}
        {showEventSpecific && eventId && (
          <button
            onClick={handleDownloadEventUsers}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>📊</span>
            <span>Download Event Users ({eventName || 'This Event'})</span>
          </button>
        )}

        {/* Download All/Filtered Events Button */}
        <button
          onClick={handleDownloadAllEvents}
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>📊</span>
          <span>
            {filteredEvents && filteredEvents.length > 0 
              ? `Download Filtered Events (${filteredEvents.length})`
              : 'Download All Events'
            }
          </span>
        </button>
      </div>

      {loading && (
        <p className="mt-3 text-blue-400 text-sm">
          Preparing download...
        </p>
      )}
    </div>
  );
};

export default CSVDownloadButtons;

/**
 * USAGE EXAMPLES:
 * 
 * 1. In Users Section (with filter support):
 * 
 * function UsersSection() {
 *   const [allUsers, setAllUsers] = useState([]);
 *   const [searchQuery, setSearchQuery] = useState('');
 *   
 *   const filteredUsers = allUsers.filter(user => 
 *     user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
 *     user.email.toLowerCase().includes(searchQuery.toLowerCase())
 *   );
 *   
 *   return (
 *     <div>
 *       <input 
 *         value={searchQuery} 
 *         onChange={(e) => setSearchQuery(e.target.value)}
 *         placeholder="Search users..."
 *       />
 *       
 *       <CSVDownloadButtons 
 *         allUsers={allUsers}
 *         filteredUsers={searchQuery ? filteredUsers : null}
 *       />
 *       
 *       {filteredUsers.map(user => ...)}
 *     </div>
 *   );
 * }
 * 
 * 
 * 2. In Events Section (with filter support):
 * 
 * function EventsSection() {
 *   const [allEvents, setAllEvents] = useState([]);
 *   const [filterDate, setFilterDate] = useState('');
 *   
 *   const filteredEvents = filterDate 
 *     ? allEvents.filter(event => event.date === filterDate)
 *     : allEvents;
 *   
 *   return (
 *     <div>
 *       <input 
 *         type="date"
 *         value={filterDate} 
 *         onChange={(e) => setFilterDate(e.target.value)}
 *       />
 *       
 *       <CSVDownloadButtons 
 *         allEvents={allEvents}
 *         filteredEvents={filterDate ? filteredEvents : null}
 *       />
 *       
 *       {filteredEvents.map(event => ...)}
 *     </div>
 *   );
 * }
 * 
 * 
 * 3. For specific event registrations:
 * 
 * <CSVDownloadButtons 
 *   eventId={event._id} 
 *   eventName={event.name} 
 *   showEventSpecific={true} 
 * />
 */