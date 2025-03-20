import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, updateEvent } from "../../apis/api_event";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
export default function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [updatedEvent, setUpdatedEvent] = useState(null);
  const [newThumbnail, setNewThumbnail] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(eventId);
        setEvent(data);
        setUpdatedEvent(data);
      } catch (error) {
        console.log("Error fetching event details:", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setUpdatedEvent({ ...updatedEvent, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (content) => {
    setUpdatedEvent({ ...updatedEvent, description: content });
  };

  const handleThumbnailChange = (e) => {
    setNewThumbnail(e.target.files[0]);
  };
  const handleSaveChanges = async () => {
    try {
      let updatedData = {
        ...updatedEvent,
      };

      if (newThumbnail) {
        updatedData.thumbnail = newThumbnail; // Ensure backend supports file uploads this way
      }

      await updateEvent(eventId, updatedData);
       try {
         const notificationData = {
           name: `${updatedEvent.name} event is updated`,
           startDate: updatedEvent.startDate,
           startTime: updatedEvent.startTime,
           eventAccess: updatedEvent.eventAccess || "Public",
         };

         await axios.post(
           "http://localhost:8080/api/notifications",
           notificationData
         );
       } catch (notificationError) {
         console.error("Error creating notification:", notificationError);

        //  toast.warning(
        //    "Event deleted but notification system encountered an issue"
        //  );
       }

      // Fetch updated event data
      const refreshedEvent = await getEventById(eventId);
      setEvent(refreshedEvent);
      setUpdatedEvent(refreshedEvent);

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Event</h2>

      <label className="block font-semibold">Event Name:</label>
      <input
        type="text"
        name="name"
        value={updatedEvent.name}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-4"
      />

      <label className="block font-semibold">Event Description:</label>
      <ReactQuill
        value={updatedEvent.description}
        onChange={handleDescriptionChange}
        className="bg-white border rounded-md"
        theme="snow"
        style={{ height: "300px", marginBottom: "70px" }}
      />

      <label className="block font-semibold">Start Date</label>
      <input
        type="date"
        name="startDate"
        value={
          updatedEvent.startDate ? updatedEvent.startDate.split("T")[0] : ""
        }
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-4"
      />

      <label className="block font-semibold">Start Time</label>
      <input
        type="time"
        name="startTime"
        value={updatedEvent.startTime}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-4"
      />

      <label className="block font-semibold">End Date</label>
      <input
        type="date"
        name="endDate"
        value={updatedEvent.endDate ? updatedEvent.endDate.split("T")[0] : ""}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-4"
      />

      <label className="block font-semibold">End Time</label>
      <input
        type="time"
        name="endTime"
        value={updatedEvent.endTime}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-4"
      />
      

      <label className="block font-semibold">Event Thumbnail:</label>
      {event.thumbnail && (
        <img
          src={
            newThumbnail ? URL.createObjectURL(newThumbnail) : event.thumbnail
          }
          alt="Event Thumbnail"
          className="w-full h-40 object-cover rounded-md mb-2"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleThumbnailChange}
        className="mb-4"
      />

      <button
        onClick={handleSaveChanges}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}
