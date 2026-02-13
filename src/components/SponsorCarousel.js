// ========================================
// SponsorCarousel.js
// Place in src/components/ folder
// ========================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from './baseUrl';

const SponsorCarousel = () => {
  const [sponsors, setSponsors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, []);

  useEffect(() => {
    if (sponsors.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === sponsors.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [sponsors]);

  const fetchSponsors = async () => {
    try {
      const response = await axios.get(`${base_url}sponsors`);
      setSponsors(response.data.sponsors || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sponsors.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === sponsors.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading sponsors...</div>;
  }

  if (sponsors.length === 0) {
    return null; // Don't show anything if no sponsors
  }

  return (
    <section className="px-8 py-16 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-400">
          Our Sponsors
        </h2>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl bg-gray-800/50 border border-gray-700 shadow-2xl min-h-[300px] flex items-center justify-center">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor._id}
                  className="min-w-full flex items-center justify-center p-12"
                >
                  <img
                    src={`${base_url}${sponsor.url}`}
                    alt={sponsor.originalName}
                    className="max-w-full max-h-[300px] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Previous Button */}
          {sponsors.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition backdrop-blur-sm"
              >
                ‹
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition backdrop-blur-sm"
              >
                ›
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {sponsors.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {sponsors.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === index 
                      ? 'bg-blue-500 w-8' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SponsorCarousel;