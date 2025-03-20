import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../apis/api_event";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const initialEventState = {
  name: "",
  description: "",
  registrationLink: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  eventAccess: "Public",
  thumbnail: null,
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(initialEventState);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (content) => {
    setEvent({ ...event, description: content });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setEvent({ ...event, thumbnail: e.target.files[0] });
    } else {
      setEvent({ ...event, thumbnail: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date and time
    const startDateTime = new Date(event.startDate);
    const [startHours, startMinutes] = event.startTime.split(":").map(Number);
    const now = new Date();
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(event.endDate);
    const [endHours, endMinutes] = event.endTime.split(":").map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    if (startDateTime < now) {
      toast.error("Start date and time cannot be in the past.");
      return;
    }

    if (endDateTime < startDateTime) {
      toast.error(
        "End date and time cannot be earlier than start date and time."
      );
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", event.name);
      formData.append("description", event.description);
      formData.append("registrationLink", event.registrationLink);
      formData.append("startDate", event.startDate);
      formData.append("startTime", event.startTime);
      formData.append("endDate", event.endDate);
      formData.append("endTime", event.endTime);
      formData.append("eventAccess", event.eventAccess);

      if (event.thumbnail) {
        formData.append("thumbnail", event.thumbnail);
      }
      try {
    
        await createEvent(formData);

       
        try {
          const notificationData = {
            name: `new event - ${event.name}`,
            startDate: event.startDate,
            startTime: event.startTime,
            eventAccess: event.eventAccess || "Public",
          };

          await axios.post(
            "http://localhost:8080/api/notifications",
            notificationData,
            { withCredentials: true }
          );
        } catch (notificationError) {
         
          console.error("Error creating notification:", notificationError);
         
          toast.warning(
            "Event created but notification system encountered an issue"
          );
        }

        // Show success message for the main action
        toast.success("Event created successfully!");

        // Navigate after a short delay
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      } catch (error) {
        console.log("Error creating event:", error);
        toast.error("Failed to create event.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
      <ToastContainer position="top-right" autoClose={3000} />
      <EventForm
        event={event}
        handleChange={handleChange}
        handleDescriptionChange={handleDescriptionChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        setEvent={setEvent}
      />
    </div>
  );
};

const EventForm = ({
  event,
  handleChange,
  handleDescriptionChange,
  handleFileChange,
  handleSubmit,
  setEvent,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <FormInput
        label="Event Name"
        type="text"
        name="name"
        value={event.name}
        onChange={handleChange}
        required
      />
      <FormRichTextEditor
        label="Event Description"
        value={event.description}
        onChange={handleDescriptionChange}
      />
      <FormDateTime
        label="Start"
        dateName="startDate"
        timeName="startTime"
        event={event}
        handleChange={handleChange}
      />
      <FormDateTime
        label="End"
        dateName="endDate"
        timeName="endTime"
        event={event}
        handleChange={handleChange}
      />
      <FormSelect
        label="Event Access"
        name="eventAccess"
        value={event.eventAccess}
        onChange={handleChange}
        options={["Public", "Product", "Marketing", "Sales", "Intern"]}
      />
      <FormFile
        label="Event Thumbnail"
        name="thumbnail"
        onChange={handleFileChange}
      />
      <FormButtons setEvent={setEvent} />
    </form>
  );
};

const FormInput = ({ label, type, name, value, onChange, required }) => (
  <div className="w-full">
    <label className="block font-semibold mb-2">{label}:</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border rounded-md"
    />
  </div>
);

const FormRichTextEditor = ({ label, value, onChange }) => (
  <div className="w-full mb-4">
    <label className="block font-semibold mb-2">{label}:</label>
    <ReactQuill
      value={value}
      onChange={onChange}
      className="bg-white border rounded-md"
      theme="snow"
      style={{ height: "300px", marginBottom: "70px" }}
    />
  </div>
);

const FormDateTime = ({ label, dateName, timeName, event, handleChange }) => (
  <div className="flex flex-col md:flex-row md:gap-6 w-full">
    <div className="w-full md:w-1/2">
      <label className="block font-semibold mb-2">{label} Date:</label>
      <input
        type="date"
        name={dateName}
        value={event[dateName]}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-md"
      />
    </div>
    <div className="w-full md:w-1/2">
      <label className="block font-semibold mb-2">{label} Time:</label>
      <input
        type="time"
        name={timeName}
        value={event[timeName]}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded-md"
      />
    </div>
  </div>
);

const FormSelect = ({ label, name, value, onChange, options }) => (
  <div className="w-full">
    <label className="block font-semibold mb-2">{label}:</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-md"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const FormFile = ({ label, name, onChange }) => (
  <div className="w-full">
    <label className="block font-semibold mb-2">{label}:</label>
    <input
      type="file"
      name={name}
      accept="image/*"
      onChange={onChange}
      className="w-full p-2 border rounded-md"
    />
  </div>
);

const FormButtons = ({ setEvent }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <button
        type="button"
        className="bg-gray-500 text-white px-4 py-2 rounded-md"
        onClick={() => {
          setEvent(initialEventState);
          navigate("/admin/dashboard");
        }}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Create Event
      </button>
    </div>
  );
};

export default CreateEvent;
