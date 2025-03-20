import { useState, useEffect } from "react";
import { MessageCircle, CalendarDays, Clock } from "lucide-react";
import axios from "axios";
import InterestedButton from "../InterestCheckbox";
import { useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";

// Define a base URL constant to use across the application
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const EventCard = ({ event, user, onEventUpdate }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (showComments) fetchComments();
  }, [showComments]);

  const fetchComments = async () => {
    if (!event?._id) return;

    setLoadingComments(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/events/${event._id}/comments`
      );
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      // setError("Failed to load comments. Please try again.");
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePostComment = async () => {
    if (!user?._id) {
      alert("Please log in to comment.");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/events/${event._id}/comment`,
        {
          _id: user._id,
          text: newComment,
        }
      );

      // Create a properly structured comment object
      const newCommentObj = {
        text: newComment,
        user: {
          _id: user._id,
          name: user.name || "You",
        },
        // Include any other fields from the API response if available
        ...(data || {}),
      };

      // Add the new comment to the beginning of the list
      setComments((prevComments) => [newCommentObj, ...(prevComments || [])]);
      setNewComment("");
    } catch (error) {
      console.error(
        "Error posting comment:",
        error.response?.data || error.message
      );
      setError("Failed to post your comment. Please try again.");
    }
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCommentExpansion = (index) => {
    setExpandedComments({
      ...expandedComments,
      [index]: !expandedComments[index],
    });
  };

  const getCommentText = (comment) => {
    return comment?.text || "";
  };

  const getCommentUserName = (comment) => {
    return (
      comment?.user?.name ||
      (comment?.user?._id === user?._id ? "You" : "Unknown User")
    );
  };

  const isCommentLong = (comment) => {
    const text = getCommentText(comment);
    return text.length > 100;
  };

  const handleHeadingClick = () => {
    if (event?._id) {
      navigate(`/eventf/${event._id}`, { state: { user } });
    }
  };

  const truncatedName = isExpanded ? event?.name : event?.name?.slice(0, 50);
  const shouldShowToggle = event?.name?.length > 50;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-2xl border border-gray-700 flex flex-col font-['Lato',sans-serif]">
      <h2
        className="text-2xl font-bold text-white tracking-wide cursor-pointer hover:text-blue-500 transition-colors font-[Lato]"
        onClick={handleHeadingClick}
      >
        {truncatedName || "Untitled Event"}
        {shouldShowToggle && (
          <span
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation
              toggleReadMore();
            }}
            className="text-white hover:text-blue-400 ml-1 font-normal"
          >
            {isExpanded ? " Read Less" : "... Read More"}
          </span>
        )}
      </h2>

      <div className="flex items-center text-white mt-2">
        <CalendarDays size={20} className="mr-2 text-blue-400" />
        <span>
          {event?.startDate
            ? new Date(event.startDate).toLocaleDateString()
            : "TBD"}
        </span>
        <Clock size={20} className="ml-4 mr-2 text-green-400" />
        <span>{event?.startTime || "TBD"}</span>
      </div>

      <p className="text-m text-white mt-4 font-[Lato]">
        {event?.description ? (
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: expanded
                  ? event.description
                  : `${event.description.slice(0, 120)}${event.description.length > 120 ? "..." : ""}`,
              }}
            />
            {!expanded && event.description.length > 120 && (
              <button
                onClick={() => setExpanded(true)}
                className="text-blue-400 ml-1 hover:text-blue-300"
              >
                Read more
              </button>
            )}
            {expanded && (
              <button
                onClick={() => setExpanded(false)}
                className="text-blue-400 mt-2 hover:text-blue-300"
              >
                Read less
              </button>
            )}
          </>
        ) : (
          "No description available"
        )}
      </p>

      {event?.thumbnail && (
        <img
          src={event.thumbnail}
          alt="Event Thumbnail"
          className="mt-4 rounded-md object-cover w-4/5 h-64 mx-auto"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/400x320?text=Image+Not+Found";
          }}
        />
      )}

      {user && (
        <InterestedButton
          event={event}
          user={user}
          onEventUpdate={onEventUpdate}
        />
      )}

      <div className="border-b border-gray-700 my-4"></div>

      {error && (
        <div className="bg-red-900 text-white p-2 rounded-md mb-4">{error}</div>
      )}

      <div className="flex justify-between w-full mt-6 text-white">
        <LikeButton event={event} user={user} onEventUpdate={onEventUpdate} />
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 hover:text-blue-400 transition-colors"
        >
          <MessageCircle size={24} /> Comments
        </button>
        <SaveButton event={event} user={user} onEventUpdate={onEventUpdate} />
      </div>

      {showComments && (
        <div className="mt-4 p-4 bg-gray-700 rounded-md">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handlePostComment}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </div>

          {loadingComments ? (
            <p className="text-white mt-2">Loading comments...</p>
          ) : comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="mt-3 p-2 border-b border-gray-600">
                <p className="text-white font-semibold">
                  {getCommentUserName(comment)}:
                </p>
                <div className="text-white overflow-hidden">
                  {isCommentLong(comment) && !expandedComments[index] ? (
                    <>
                      <p className="line-clamp-2">{getCommentText(comment)}</p>
                      <button
                        onClick={() => toggleCommentExpansion(index)}
                        className="text-blue-400 text-sm mt-1 hover:underline"
                      >
                        Read more
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{getCommentText(comment)}</p>
                      {isCommentLong(comment) && (
                        <button
                          onClick={() => toggleCommentExpansion(index)}
                          className="text-blue-400 text-sm mt-1 hover:underline"
                        >
                          Show less
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white mt-3">Be the first to comment!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
