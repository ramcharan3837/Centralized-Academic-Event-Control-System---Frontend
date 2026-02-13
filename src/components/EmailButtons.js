// ========================================
// EmailButtons.js
// Place in src/components/ folder
// ========================================

import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from './baseUrl';

const EmailButtons = ({ eventId, eventName }) => {
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailType, setEmailType] = useState('');
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });

  const handleSendEmailRegistered = () => {
    setEmailType('registered');
    setEmailData({
      subject: `Reminder: ${eventName}`,
      message: 'This is a reminder about your registered event.'
    });
    setShowEmailModal(true);
  };

  const handleSendEmailAll = () => {
    setEmailType('all');
    setEmailData({
      subject: 'Event Announcement',
      message: 'We have an exciting event coming up!'
    });
    setShowEmailModal(true);
  };

  const sendEmail = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      let response;
      if (emailType === 'registered') {
        response = await axios.post(
          `${base_url}send-email-registered/${eventId}`,
          emailData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        response = await axios.post(
          `${base_url}send-email-all`,
          { ...emailData, eventId },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      alert(response.data.message);
      setShowEmailModal(false);
      setEmailData({ subject: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      alert(error.response?.data?.message || 'Failed to send emails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 mt-4 mb-4">
        <button
          onClick={handleSendEmailRegistered}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2"
        >
          <span>📧</span>
          <span>Send Email to Registered Users</span>
        </button>

        <button
          onClick={handleSendEmailAll}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2"
        >
          <span>📧</span>
          <span>Send Email to All Users</span>
        </button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-400">
                {emailType === 'registered' 
                  ? 'Send Email to Registered Users' 
                  : 'Send Email to All Users'}
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject:
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message:
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  rows="6"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowEmailModal(false)}
                  disabled={loading}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={sendEmail}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailButtons;