import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

export default function EventCard({ event, onDelete, activeTab }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  const onDeleteEvent = async () => {
    setLoading(true);
    await handleDeleteEvent(event.id);
    setLoading(false);
    setShowDeleteModal(false);
  };

  const handleEditClick = () => {
    navigate(`/admin/event/${event._id}`);
  };

  const handleSendInvite = () => {
    navigate(`/admin/sendinvite/${event._id}`);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDeleteEvent = async () => {
    setLoading(true);
    try {
      // Instead of using DELETE method, we'll use PATCH to update the isDeleted flag
      await axios.patch(
        `http://localhost:8080/events/soft-delete/${event._id}`,
        { isDeleted: true, deletedAt: new Date() },
        { withCredentials: true }
      );

      toast.success("Event successfully deleted!");
      setDeleted(true);
      try {
        const notificationData = {
          name: `${event.name} event is deleted`,
          startDate: event.startDate,
          startTime: event.startTime,
          eventAccess: event.eventAccess || "Public",
        };

        await axios.post(
          "http://localhost:8080/api/notifications",
          notificationData
        );
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError);

        toast.warning(
          "Event deleted but notification system encountered an issue"
        );
      }
      if (onDelete) onDelete(event._id);
    } catch (error) {
      console.error("Error soft-deleting event:", error);
      toast.error("Failed to delete event.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (deleted) return null;

  return (
    <div className="flex flex-col bg-white shadow-xl rounded-lg p-6 border w-full max-w-4xl mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative">
      {event.eventAccess && (
        <div className="absolute left-0 top-[420px] z-10">
          <div className="bg-blue-500 text-white px-2 py-1 rounded-r-md text-xs font-semibold shadow-md">
            {event.eventAccess}
          </div>
        </div>
      )}

      {/* Action button with dropdown - Hidden when activeTab is "Cancelled" */}
      {activeTab !== "Cancelled" && (
        <div className="absolute top-1 right-5">
          <button
            onClick={toggleDropdown}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
          >
            <FiMoreHorizontal className="text-gray-600" />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
              <div className="py-1">
                <button
                  onClick={handleSendInvite}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Send Invite
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowDeleteModal(true);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Event details */}
      <img
        src={event.thumbnail || "https://via.placeholder.com/600"}
        alt={event.name}
        className="w-full h-80 object-cover rounded-lg transition-opacity duration-300 hover:opacity-90"
      />

      <div className="mt-4 text-center h-32 flex flex-col">
        <h2 className="text-xl font-medium text-blue-600 tracking-wide overflow-hidden">
          {isExpanded ? event.name : event.name.slice(0, 50)}
          {event.name.length > 50 && (
            <span
              onClick={toggleReadMore}
              className="text-blue-500 cursor-pointer ml-1 inline-block"
            >
              {isExpanded ? " Read Less" : "... Read More"}
            </span>
          )}
        </h2>
        <p className="text-gray-500 text-lg">{event.event_type}</p>
        <p className="text-gray-600 mt-2 text-md">
          {formatDate(event.startDate)}
        </p>
      </div>

      {activeTab !== "Cancelled" && (
        <div className="mt-auto">
          <button
            onClick={handleEditClick}
            className="w-full px-2 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-all duration-300"
          >
            Edit
          </button>
        </div>
      )}

      {/* Click outside handler for dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Do you want to delete this event?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={onDeleteEvent}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
