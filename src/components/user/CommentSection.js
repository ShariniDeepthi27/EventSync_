import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const CommentSection = ({ event, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

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

      const newCommentObj = {
        text: newComment,
        user: {
          _id: user._id,
          name: user.name || "You",
        },
        ...(data || {}),
      };

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

  const toggleCommentExpansion = (index) => {
    setExpandedComments({
      ...expandedComments,
      [index]: !expandedComments[index],
    });
  };

  const getCommentText = (comment) => comment?.text || "";
  const getCommentUserName = (comment) =>
    comment?.user?.name ||
    (comment?.user?._id === user?._id ? "You" : "Unknown User");
  const isCommentLong = (comment) => getCommentText(comment).length > 100;

  return (
    <div className="mt-10 w-full max-w-5xl p-6 bg-gray-700 rounded-md">
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
        <p className="text-gray-300 mt-2">Loading comments...</p>
      ) : comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index} className="mt-3 p-2 border-b border-gray-600">
            <p className="text-gray-200 font-semibold">
              {getCommentUserName(comment)}:
            </p>
            <div className="text-gray-300 overflow-hidden">
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
        <p className="text-gray-300 mt-3">Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentSection;
