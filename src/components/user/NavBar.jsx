import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faCalendar,
  faCircle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAuth } from "../../context/authContext";

export default function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  // const navigate = useNavigate();
  const { user } = useAuth();

  // Base URL for API calls
  const API_BASE_URL = "http://localhost:8080";

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!user || !user._id) {
        console.log("No user found or user ID missing", user);
        return;
      }

      try {
        console.log("Fetching notifications for user:", user._id);
        const response = await axios.get(
          `${API_BASE_URL}/api/notifications/unread/${user._id}`
        );

        console.log("API Response:", response.data); // Log the response

        if (response.data.success) {
          console.log("Notifications received:", response.data.data);
          setUnreadCount(response.data.count);
          setNotifications(response.data.data);
        }
      } catch (error) {
        console.error(
          "Error fetching unread notifications:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchUnreadNotifications();

    const intervalId = setInterval(fetchUnreadNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  // Toggle notifications dropdown
  const toggleNotifications = (e) => {
    e.preventDefault();
    setShowNotifications((prev) => !prev);
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    if (!user || !user._id) {
      console.error("No user found or user ID missing");
      return;
    }

    try {
      // Make sure the ID is a valid format before sending
      if (!notificationId || typeof notificationId !== "string") {
        console.error("Invalid notification ID:", notificationId);
        return;
      }

      console.log(
        `Marking notification ${notificationId} as read for user ${user._id}`
      );

      const response = await axios.post(
        `${API_BASE_URL}/api/notifications/markAsRead/${notificationId}`,
        {
          userId: user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Mark as read response:", response.data);

      if (response.data.success) {
        // Update local state
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId)
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error(
        "Error marking notification as read:",
        error.response ? error.response.data : error.message
      );

      // Provide more detailed error information
      if (error.response && error.response.data) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <>
      {/* Fixed Navbar - Changed to gray theme */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-lg z-50 h-16 flex items-center">
        <div className="w-full px-4 flex justify-between items-center">
          {/* Logo - Moved to maximum left by removing container */}
          <div className="ml-0">
            <Link
              to="/login"
              className="text-2xl font-bold text-white hover:text-gray-300 transition"
            >
              EventSync
            </Link>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Calendar Link - Increased spacing between icon and text */}
            <Link
              to="/calendar"
              className="flex flex-col items-center p-2 rounded hover:bg-gray-700 transition"
              title="Calendar"
            >
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-white text-lg"
              />
              <span className="text-xs text-white mt-3">Calendar</span>
            </Link>

            {/* Notifications - Increased spacing between icon and text */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="flex flex-col items-center p-2 rounded hover:bg-gray-700 transition relative"
                title="Notifications"
              >
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-white text-lg"
                  />
                  {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </div>
                  )}
                </div>
                <span className="text-xs text-white mt-2">Notifications</span>
              </button>

              {/* Notifications Dropdown - Gray theme */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-h-96 overflow-y-auto z-50">
                  <div className="p-3 border-b border-gray-300 bg-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      Notifications ({unreadCount})
                    </h3>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  ) : (
                    <ul>
                      {notifications.map((notification) => (
                        <li
                          key={notification._id}
                          className="border-b border-gray-200 last:border-0 hover:bg-gray-200"
                        >
                          <div className="p-3 flex items-start">
                            <div className="mt-1 mr-2">
                              <FontAwesomeIcon
                                icon={faCircle}
                                className="text-blue-600 text-xs"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {notification.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {formatDate(notification.startDate)} •{" "}
                                {notification.eventAccess}
                              </p>
                            </div>
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                              title="Mark as read"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  
                </div>
              )}
            </div>

            {/* Profile Link - Increased spacing between icon and text */}
            <Link
              to="/profile"
              className="flex flex-col items-center p-2 rounded hover:bg-gray-700 transition"
              title="Profile"
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-white text-xl"
              />
              <span className="text-xs text-white mt-3">Profile</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Padding */}
      <div className="h-16"></div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={() => setShowNotifications(false)}
        ></div>
      )}
    </>
  );
}
