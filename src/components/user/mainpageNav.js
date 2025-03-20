// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-700 bg-opacity-90 backdrop-blur-md shadow-lg z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/signup"
          className="flex items-center"
          style={{ textDecoration: "none" }}
        >
          <span className="text-2xl font-bold text-white">EventSync</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link
            to="/mainpage"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/signup"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
