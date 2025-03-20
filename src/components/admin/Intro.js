import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
const Intro = () => {
    const navigate=useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Manage Events with ease and efficiency.
        </p>
        <button
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          onClick={() => navigate("/admin/dashboard")}
        >
          Let's Go
        </button>
      </div>
    </div>
  );
};

export default Intro;
