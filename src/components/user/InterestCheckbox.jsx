import { useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const InterestedButton = ({ event, user }) => {
  const [isInterested, setIsInterested] = useState(
    event.responseBy?.includes(user?._id) || false
  );

  const handleInterest = async () => {
    if (!user?._id)
      return alert("Please log in to mark interest in this event.");
    try {
      const response = await axios.post(
        `http://localhost:8080/events/${event._id}/userresponse`,
        { _id: user._id }
      );
      setIsInterested(response.data.responseBy.includes(user._id));
    } catch (error) {
      console.error(
        "Error updating interest:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="mt-4 flex items-center space-x-2">
      <button
        onClick={handleInterest}
        className="flex items-center gap-1 text-white-900 font-medium"
      >
        <Star
          size={24}
          fill={isInterested ? "blue" : "none"}
          stroke={isInterested ? "blue" : "gray"}
        />
        <span className="font-[Lato]">
          I'm interested
        </span>
      </button>
    </div>
  );
};

export default InterestedButton;
