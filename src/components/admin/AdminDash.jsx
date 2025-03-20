import { useState, useEffect } from "react";
import { fetchEventsByStatus } from "../../apis/api_event";
import { Calendar, Users, Loader2, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccess, setSelectedAccess] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventData = await fetchEventsByStatus("live");
        setEvents(eventData);
        setFilteredEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  // Get unique event access types
  const eventAccessTypes = [
    "All",
    ...new Set(events.map((event) => event.eventAccess || "Other")),
  ];

  // Filter events based on selected access type
  const handleAccessChange = (access) => {
    setSelectedAccess(access);
    setDropdownOpen(false);

    if (access === "All") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => event.eventAccess === access);
      setFilteredEvents(filtered);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>

        {/* Event Access Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedAccess} Events <ChevronDown className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              {eventAccessTypes.map((access) => (
                <button
                  key={access}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => handleAccessChange(access)}
                >
                  {access}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          icon={<Calendar className="w-6 h-6 text-blue-500" />}
          label="Live Events"
          value={filteredEvents.length}
          color="blue"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <p className="text-center text-gray-500">
          No events available for the selected criteria.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              count={event.responseBy?.length || 0}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-md flex items-center gap-4 border-l-4 border-${color}-500`}
  >
    <div className={`p-3 rounded-full bg-${color}-100`}>{icon}</div>
    <div>
      <h2 className="text-lg font-semibold text-gray-600">{label}</h2>
      <p className={`text-${color}-500 text-3xl font-bold`}>{value}</p>
    </div>
  </div>
);

const EventCard = ({ event, count, navigate }) => {
  const eventDate = new Date(event.startDate);

  const handleMarkAttendance = () => {
    navigate(`/admin/qrread?id=${event._id}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 border border-gray-100 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {event.name}
        </h2>
        <p className="text-gray-600">
          <strong>Start Date:</strong>{" "}
          {event.startDate ? eventDate.toLocaleDateString() : "N/A"}
        </p>
        <p className="text-gray-600">
          <strong>Start Time:</strong> {event.startTime || "N/A"}
        </p>
        <p className="text-gray-600">
          <strong>Access Type:</strong> {event.eventAccess || "N/A"}
        </p>
        <div className="flex items-center gap-2 mt-4">
          <Users className="w-5 h-5 text-blue-500" />
          <p className="text-gray-800 font-medium">{count} Registered Users</p>
        </div>
      </div>
      <button
        onClick={handleMarkAttendance}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Mark Attendance
      </button>
    </div>
  );
};

export default AdminDashboard;
