import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import axios from "axios";

// Define a base URL constant to use across the application
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const SaveButton = ({ event, user, onEventUpdate }) => {
  const [saved, setSaved] = useState(
    event?.savedBy?.includes(user?._id) || false
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update local state when event prop changes
    setSaved(event?.savedBy?.includes(user?._id) || false);
  }, [event, user]);

  const handleSave = async () => {
    if (!user?._id) {
      alert("Please log in to save this event.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/events/${event._id}/save`,
        { _id: user._id }
      );

      if (data) {
        setSaved(data.savedBy?.includes(user._id) || false);

        // Call the optional update handler to inform parent components
        if (onEventUpdate && typeof onEventUpdate === "function") {
          onEventUpdate({ ...event, savedBy: data.savedBy });
        }
      }
    } catch (error) {
      console.error(
        "Error saving event:",
        error.response?.data || error.message
      );
      setError("Failed to save the event. Please try again.");
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-900 text-white p-2 rounded-md mb-4">{error}</div>
      )}
      <button
        onClick={handleSave}
        className={`flex items-center gap-1 ${saved ? "text-blue-400" : "text-gray-300"} hover:text-blue-300 transition-colors`}
      >
        <Bookmark
          size={24}
          fill={saved ? "blue" : "none"}
          stroke={saved ? "blue" : "gray"}
        />
        Save
      </button>
    </>
  );
};

export default SaveButton;
