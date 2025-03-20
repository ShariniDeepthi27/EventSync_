import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import axios from "axios";

// Define a base URL constant to use across the application
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const LikeButton = ({ event, user, onEventUpdate }) => {
  const [liked, setLiked] = useState(
    event?.likedBy?.includes(user?._id) || false
  );
  const [likeCount, setLikeCount] = useState(event?.likedBy?.length || 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update local state when event prop changes
    setLiked(event?.likedBy?.includes(user?._id) || false);
    setLikeCount(event?.likedBy?.length || 0);
  }, [event, user]);

  const handleLike = async () => {
    if (!user?._id) {
      alert("Please log in to like this event.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/events/${event._id}/like`,
        { _id: user._id }
      );

      if (data) {
        setLiked(data.likedBy?.includes(user._id) || false);
        setLikeCount(data.likedBy?.length || 0);

        // Call the optional update handler to inform parent components
        if (onEventUpdate && typeof onEventUpdate === "function") {
          onEventUpdate({ ...event, likedBy: data.likedBy });
        }
      }
    } catch (error) {
      console.error(
        "Error liking event:",
        error.response?.data || error.message
      );
      setError("Failed to like the event. Please try again.");
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-900 text-white p-2 rounded-md mb-4">{error}</div>
      )}
      <button
        onClick={handleLike}
        className={`flex items-center gap-1 ${liked ? "text-red-400" : "text-gray-300"} hover:text-red-300 transition-colors`}
      >
        <Heart
          size={24}
          fill={liked ? "red" : "none"}
          stroke={liked ? "red" : "gray"}
        />
        {likeCount}
      </button>
    </>
  );
};

export default LikeButton;
