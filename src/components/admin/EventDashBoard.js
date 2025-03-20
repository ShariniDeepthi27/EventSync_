import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import { BiSort } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import { fetchEventsByStatus } from "../../apis/api_event"; // Import API call function

export default function EventDashboard() {
  const [activeTab, setActiveTab] = useState("Live");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventData = await fetchEventsByStatus(activeTab);
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    getEvents();
  }, [activeTab]);

  // Function to handle event updates (triggered in EventCard)
  const handleEventUpdate = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event._id === updatedEvent._id ? updatedEvent : event))
    );
  };

  // Function to handle event deletion
  const handleEventDelete = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-xl font-semibold">Events</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => navigate("/admin/createevent")}
          >
            <IoMdAdd /> Create Event
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 my-4 border-b pb-2">
          {["Live", "Future", "Past", "Cancelled", "All"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 ${
                activeTab === tab ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>


        {/* Event Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event._id} event={event} onEventUpdate={handleEventUpdate} onDelete={handleEventDelete} activeTab={activeTab} />
            ))
          ) : (
            <p className="text-gray-500">No events found</p>
          )}
        </div>
      </div>
    </div>
  );
}
