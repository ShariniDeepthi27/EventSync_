import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./eventcard/Card";
// import EventCard from "./PostCard";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UserActivity = () => {
  const [activeTab, setActiveTab] = useState("liked");
  const [likedEvents, setLikedEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.warn("User not found, redirecting to login...");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching activity for user: ${user._id}`);

        // Fetch liked events
        const likedResponse = await axios.get(
          `http://localhost:8080/events/liked?userId=${user._id}`
        );
        setLikedEvents(likedResponse.data);

        // Fetch saved events
        const savedResponse = await axios.get(
          `http://localhost:8080/events/saved?userId=${user._id}`
        );
        setSavedEvents(savedResponse.data);
      } catch (err) {
        console.error(
          "Error fetching user activity:",
          err.response?.data || err.message
        );
        setError(
          err.response?.data?.message || "Failed to fetch user activity"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, [user]);

  // Function to switch between tabs
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Get current events based on active tab
  const currentEvents = activeTab === "liked" ? likedEvents : savedEvents;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-16">
      {/* <Navbar /> */}

      <div className="container mx-auto px-4 py-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Your Activity
        </motion.h1>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800 rounded-lg inline-flex p-1">
            <button
              onClick={() => handleTabChange("liked")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "liked"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              Liked Events ({likedEvents.length})
            </button>
            <button
              onClick={() => handleTabChange("saved")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "saved"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              Saved Events ({savedEvents.length})
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-blue-400 text-lg py-8"
          >
            Loading your activity...
          </motion.div>
        )}

        {/* Error State */}
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

        {/* No Events State */}
        {currentEvents.length === 0 && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-blue-400 text-lg py-8"
          >
            {activeTab === "liked"
              ? "You haven't liked any events yet"
              : "You haven't saved any events yet"}
          </motion.div>
        )}

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-6 p-6"
        >
          {currentEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full max-w-2xl"
            >
              <EventCard event={event} user={user} activityType={activeTab} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default UserActivity;
