// ========================================
// SponsorImageManager.js
// Place in src/components/ folder
// ========================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from './baseUrl';

const SponsorImageManager = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${base_url}sponsors`);
      setSponsors(response.data.sponsors || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();

    if (files.length === 1) {
      formData.append('sponsorImage', files[0]);
    } else {
      for (let i = 0; i < files.length; i++) {
        formData.append('sponsorImages', files[i]);
      }
    }

    try {
      const endpoint = files.length === 1 
        ? `${base_url}sponsors/upload` 
        : `${base_url}sponsors/upload-multiple`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      alert(response.data.message);
      fetchSponsors();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteSponsor = async (sponsorId) => {
    if (!window.confirm('Are you sure you want to delete this sponsor image?')) {
      return;
    }

    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.delete(`${base_url}sponsors/${sponsorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message);
      fetchSponsors();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      alert('Failed to delete sponsor image. Please try again.');
    }
  };

  const handleToggleActive = async (sponsorId) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.put(`${base_url}sponsors/${sponsorId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message);
      fetchSponsors();
    } catch (error) {
      console.error('Error toggling sponsor status:', error);
      alert('Failed to update sponsor status. Please try again.');
    }
  };

  return (
    <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
      <h3 className="text-2xl font-bold text-blue-400 mb-6">🖼️ Sponsor Image Management</h3>

      {/* Upload Section */}
      <div className="mb-8">
        <label
          htmlFor="sponsor-upload"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all hover:shadow-lg"
          style={{ opacity: uploading ? 0.6 : 1, cursor: uploading ? 'not-allowed' : 'pointer' }}
        >
          {uploading ? 'Uploading...' : '📤 Upload Sponsor Images'}
        </label>
        <input
          id="sponsor-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
        <p className="mt-3 text-sm text-gray-400">
          You can select multiple images at once (Max 5MB per image)
        </p>
      </div>

      {/* Sponsors List */}
      {loading ? (
        <p className="text-gray-400">Loading sponsors...</p>
      ) : sponsors.length === 0 ? (
        <p className="text-gray-400">No sponsor images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor._id}
              className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <img
                src={`${base_url}${sponsor.url}`}
                alt={sponsor.originalName}
                className="w-full h-40 object-contain mb-3 rounded-lg bg-gray-800/50"
              />
              <p className="text-sm text-gray-300 mb-2 truncate" title={sponsor.originalName}>
                {sponsor.originalName}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Uploaded: {new Date(sponsor.uploadedAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(sponsor._id)}
                  className={`flex-1 ${
                    sponsor.isActive 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white px-3 py-1.5 rounded-lg text-sm font-medium transition`}
                >
                  {sponsor.isActive ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleDeleteSponsor(sponsor._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SponsorImageManager;