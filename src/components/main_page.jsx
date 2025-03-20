import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// import Navbar from "./user/mainpageNav"; // Import the Navbar component

const MainPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* <Navbar /> Using the Navbar component */}
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            Welcome to <span className="text-blue-300">EventSync</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Plan, Organize and Sync events
          </p>

          {/* Call-to-Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex space-x-4 justify-center"
          >
            <Link
              to="/signup"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-transparent border border-blue-500 text-blue-300 px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition duration-300"
            >
              Login
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MainPage;
