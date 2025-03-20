import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaCalendarAlt,FaChartLine, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/authContext";
export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { handleLogout } = useAuth();

  return (
    <div className="flex">
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white p-5 pt-8 duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex justify-between items-center">
          <h1
            className={`text-xl font-bold ${!isOpen && "hidden"} duration-300`}
          >
            EventSync Admin
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-xl focus:outline-none"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <nav className="mt-10">
          <ul>
            <li className="mb-4">
              <Link
                to="/admin/analytics"
                className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg"
              >
                <FaChartLine /> {/* Use the new icon here */}
                <span className={`${!isOpen && "hidden"}`}>Overview</span>
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/admin/admindashboard"
                className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg"
              >
                <FaTachometerAlt />
                <span className={`${!isOpen && "hidden"}`}>Attendance</span>
              </Link>
            </li>
            {/* <li className="mb-4">
              <Link
                to="/admin/users"
                className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg"
              >
                <FaUser />
                <span className={`${!isOpen && "hidden"}`}>Users</span>
              </Link>
            </li> */}
            <li className="mb-4">
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg"
              >
                <FaCalendarAlt />
                <span className={`${!isOpen && "hidden"}`}>Events</span>
              </Link>
            </li>
            <li>
              <div
                onClick={() => {
                  handleLogout();
                }}
                className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
              >
                <FaSignOutAlt />
                <span className={`${!isOpen && "hidden"}`}>Logout</span>
              </div>
            </li>
            {/* <li className="mb-4">
              <Link to="/admin/settings" className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded-lg">
                <FaCog />
                <span className={`${!isOpen && "hidden"}`}>Settings</span>
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>

      <div
        className={`flex-1 p-10 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}
      >
        <Outlet />
        {/* changes to do here */}
      </div>
    </div>
  );
}
