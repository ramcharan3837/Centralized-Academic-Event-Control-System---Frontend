// src/components/Toast.js
import React from "react";

function Toast({ message, show }) {
  return (
    <div
      className={`fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {message}
    </div>
  );
}

export default Toast;
