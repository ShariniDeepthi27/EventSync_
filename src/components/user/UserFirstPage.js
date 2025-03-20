import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./eventcard/Card";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationToken, setNotificationToken] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    limit: 5,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!user) {
      console.warn("User not logged in, redirecting...");
      navigate("/login");
    }
  }, [user, navigate]);

  // 🔹 Fetch Events
  const fetchEvents = async (page = 1, limit = 5) => {
    if (!user) return;

    setLoading(true);
    try {
      console.log(
        `Fetching events for department: ${user.dept}, page: ${page}, limit: ${limit}`
      );
      const response = await axios.get(
        `http://localhost:8080/events/eventaccess?eventAccess=${user.dept}&page=${page}&limit=${limit}`
      );
      setEvents(response.data.events);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error(
        "Error fetching events:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(pagination.currentPage, pagination.limit);
  }, [user]);

  
  useEffect(() => {
    const updateUserToken = async () => {
      if (!user || !notificationToken) return;

      try {
        await axios.put(`http://localhost:8080/api/auth/addtoken/${user._id}`, {
          token: notificationToken,
        });
        console.log("Token added successfully!");
      } catch (error) {
        console.error(
          "Error adding token:",
          error.response?.data || error.message
        );
      }
    };

    updateUserToken();
  }, [user, notificationToken]);

  
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchEvents(newPage, pagination.limit);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-0">
   
      {notificationPermission === "denied" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-800 text-yellow-100 p-2 text-center"
        >
          Notifications are disabled. Some features may be limited.
        </motion.div>
      )}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-blue-400 text-lg py-8"
        >
          Loading events...
        </motion.div>
      )}

      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-red-500 text-lg py-8"
        >
          {error}
        </motion.div>
      )}

   
      {events.length === 0 && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-blue-400 text-lg py-8"
        >
          No events available
        </motion.div>
      )}

      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col items-center gap-6 p-3"
      >
        {events.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="w-full max-w-2xl"
          >
            <EventCard event={event} user={user} />
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pb-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`px-2 py-2 rounded ${
              pagination.currentPage === 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <div className="text-gray-300">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className={`px-4 py-2 rounded ${
              pagination.currentPage >= pagination.totalPages
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Events Count */}
      {/* <div className="text-center text-gray-400 pb-6">
        Showing {events.length} of {pagination.totalEvents} events
      </div> */}
    </div>
  );
};

export default EventsPage;
