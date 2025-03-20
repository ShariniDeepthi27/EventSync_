import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  CalendarDays,
  ArrowLeft,
  Share2,
  Tag,
  AlertTriangle,
} from "lucide-react";
import InterestedButton from "./InterestCheckbox";
import LikeButton from "./eventcard/LikeButton";
import SaveButton from "./eventcard/SaveButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommentSection from "./CommentSection";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const EventFullPage = () => {
  const location = useLocation();
  const user = location.state?.user;
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    console.log("Current URL:", window.location.href);
    console.log("Event ID from params:", eventId);

    const extractIdFromUrl = () => {
      const pathSegments = window.location.pathname.split("/");
      const potentialEventId = pathSegments[pathSegments.length - 1];
      return potentialEventId;
    };

    const effectiveEventId = eventId || extractIdFromUrl();
    console.log("Effective Event ID:", effectiveEventId);

    fetchEventDetails(effectiveEventId);
  }, [eventId]);

  const fetchEventDetails = async (id) => {
    if (!id) {
      console.error("Event ID is missing or invalid");
      setLoading(false);
      setError(
        "Event ID is missing from the URL. Please check the URL and try again."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      console.log("Fetching event with ID:", id);
      const { data } = await axios.get(`${API_BASE_URL}/events/${id}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!data) {
        throw new Error("Event not found");
      }

      // console.log("Event data received:", data);
      setEvent(data);
    } catch (err) {
      console.error("Error fetching event details:", err);
      const errorMessage =
        err.response?.status === 404
          ? "Event not found. It may have been removed or the URL is incorrect."
          : err.name === "AbortError"
            ? "Request timed out. Please check your connection and try again."
            : `Failed to load event details: ${err.message || "Unknown error"}`;

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const shareEvent = (event) => {
    if (navigator.share) {
      navigator
        .share({
          title: event?.name,
          text: `Check out this event: ${event?.name}`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          toast.error("Failed to share the event.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          console.log("Link copied to clipboard!"); // Debugging line
          toast.success("Event link copied to clipboard!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
          toast.error("Failed to copy link to clipboard.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
    } else {
      console.error("Clipboard API not supported");
      toast.error("Clipboard not supported in this browser.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "TBD";

      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Invalid date format:", error);
      return "TBD";
    }
  };

  const handleEventUpdate = (updatedEvent) => {
    if (!updatedEvent) return;

    setEvent((prev) => ({
      ...prev,
      ...updatedEvent,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-xl flex items-center gap-3">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading event details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 text-red-400 mb-4">
          <AlertTriangle size={24} />
          <div className="text-xl">{error}</div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
        >
          <ArrowLeft size={20} /> Go Back
        </button>
        <div className="mt-4 text-gray-400">
          Current URL: {window.location.href}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
        <div className="text-xl mb-4">Event not found</div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
        >
          <ArrowLeft size={20} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {error && (
        <div className="max-w-6xl mx-auto mb-4 bg-red-900 text-white p-3 rounded-lg flex items-center gap-2">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto rounded-lg shadow-xl overflow-hidden">
        <div className="relative h-64 md:h-96">
          {event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/800x400?text=Event+Image+Not+Available";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center">
              <h1 className="text-3xl md:text-5xl font-bold text-center px-4">
                {event.name}
              </h1>
            </div>
          )}
          {event.thumbnail && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              {/* Title can go here if needed */}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap justify-between gap-4 mb-8">
            <div className="flex flex-col items-start gap-1">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-wide cursor-pointer hover:text-blue-500 transition-colors font-[Lato]">
                  {event.name}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-purple-400" />
                <span className="text-xl font-bold text-white tracking-wide  transition-colors font-[Lato] flex items-center gap-3">
                  {event.eventAccess}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <LikeButton
                event={event}
                user={user}
                onEventUpdate={handleEventUpdate}
              />

              <SaveButton
                event={event}
                user={user}
                onEventUpdate={handleEventUpdate}
              />

              <button
                onClick={shareEvent}
                className="flex items-center gap-1 text-gray-300 hover:text-green-300 transition-colors"
              >
                <Share2 size={24} />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-white tracking-wide  transition-colors font-[Lato] flex items-center gap-3">
                About This Event
              </h2>
              <div
                className="text-white mb-8 prose prose-invert max-w-none font-[Lato]"
                dangerouslySetInnerHTML={{
                  __html: event.description || "No description available.",
                }}
              />
            </div>

            <div className="space-y-6">
              <div className="bg-gray-700 p-5 rounded-lg">
                <h2 className="text-2xl font-bold text-white tracking-wide  transition-colors font-[Lato] flex items-center gap-3">
                  Event Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <CalendarDays size={18} className="text-green-400" />
                      Date & Time
                    </h3>
                    <div className="text-gray-300 space-y-1">
                      <p>
                        <strong>Starts:</strong> {formatDate(event.startDate)}{" "}
                        at {event.startTime || "TBD"}{" "}
                        <span className="text-sm text-gray-400">
                          (24-hour format)
                        </span>
                      </p>
                      {event.endDate && (
                        <p>
                          <strong>Ends:</strong> {formatDate(event.endDate)} at{" "}
                          {event.endTime || "TBD"}{" "}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-300">
                      {user && (
                        <div className="mt-4">
                          <InterestedButton
                            event={event}
                            user={user}
                            onEventUpdate={handleEventUpdate}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="w-full min-h-[800px] md:min-h-[1000px] bg-gray-800 p-5 rounded-lg text-gray-300 mb-8 prose prose-invert max-w-none">
                <h2 className="text-xl font-semibold mb-4 text-blue-400">
                  Comments
                </h2>
                <CommentSection event={event} user={user} />
              </div>
            </div>

            {/* <div className="w-full h-[1000px]">
              <CommentSection event={event} user={user} />
            </div> */}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EventFullPage;
