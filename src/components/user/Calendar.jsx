/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default styles
import { format, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
// import Navbar from "./NavBar";
import { useAuth } from "../../context/authContext";
import InterestedButton from "./InterestCheckbox";
import axios from "axios"; // Import Axios for API calls

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [allEventDates, setAllEventDates] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 50; // Maximum characters to show before truncating

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (user?._id) {
      fetchEvents(selectedDate);
      fetchAllEventDates();
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      fetchEvents(selectedDate);
    }
  }, [selectedDate]);

  const fetchEvents = async (date) => {
    setIsLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");

      // Call the API to fetch events by date and department
      const response = await axios.get(
        "http://localhost:8080/events/geteventbydate",
        {
          params: {
            date: formattedDate,
            department: user.dept, // Use the user's department
          },
        }
      );

      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Error fetching events.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchAllEventDates = async () => {
    try {
      // You'll need to create this endpoint on your backend
      const response = await axios.get(
        "http://localhost:8080/events/getalleventdates",
        {
          params: {
            department: user.dept,
          },
        }
      );

      // Convert string dates to Date objects
      const dates = response.data.map((dateStr) => new Date(dateStr));
      setAllEventDates(dates);
    } catch (error) {
      console.error("Error fetching event dates:", error);
    }
  };

  // Custom tile content to show dots for dates with events
  const tileContent = ({ date, view }) => {
    // Only add dots in month view
    if (view !== "month") return null;

    // Check if the date has any events
    const hasEvent = allEventDates.some((eventDate) =>
      isSameDay(eventDate, date)
    );

    return hasEvent ? (
      <div className="event-marker">
        <div className="event-dot"></div>
      </div>
    ) : null;
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-300 text-lg py-8"
      >
        Loading user...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center text-red-500 text-lg py-8"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-16">
      {/* <Navbar /> */}
      <div className="flex flex-row p-8 mt-10 space-x-8">
        {/* Calendar Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-1/3"
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-400">
            Event Calendar
          </h2>
          <div className="react-calendar-custom">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              className="border border-gray-700 rounded-lg p-4 shadow-lg bg-gray-800 text-gray-100"
            />
          </div>
        </motion.div>

        {/* Events List Section */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.8 }}
            className="w-2/3"
          >
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Events on {format(selectedDate, "dd MMMM yyyy")}
            </h3>

            {isLoading ? (
              <p className="text-gray-300">Loading events...</p>
            ) : events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="p-6 bg-gray-800 rounded-lg shadow-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-blue-400">
                        {event.name.length > maxLength && !isExpanded
                          ? `${event.name.substring(0, maxLength)}... `
                          : event.name}
                        {event.name.length > maxLength && (
                          <button
                            onClick={toggleReadMore}
                            className="text-blue-200 hover:text-blue-100 underline focus:outline-none"
                          >
                            {isExpanded ? "Read less" : "Read more"}
                          </button>
                        )}
                      </p>
                      <p className="text-gray-300">
                        Start Time: {event.startTime || "N/A"}
                      </p>
                    </div>
                    <InterestedButton event={event} user={user} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300">No events found</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Custom CSS for the calendar */}
      <style>
        {`
          .react-calendar-custom .react-calendar {
            background-color: #1f2937; /* bg-gray-800 */
            color: #f3f4f6; /* text-gray-100 */
            border: 1px solid #374151; /* border-gray-700 */
            border-radius: 0.5rem; /* rounded-lg */
          }

          .react-calendar-custom .react-calendar__navigation button {
            color: #60a5fa; /* text-blue-400 */
            background: none;
            font-size: 1rem;
            font-weight: bold;
          }

          .react-calendar-custom .react-calendar__navigation button:enabled:hover,
          .react-calendar-custom .react-calendar__navigation button:enabled:focus {
            background-color: #374151; /* hover:bg-gray-700 */
          }

          .react-calendar-custom .react-calendar__tile {
            color: #f3f4f6; /* text-gray-100 */
            position: relative;
            padding-top: 14px;
          }

          .react-calendar-custom .react-calendar__tile:enabled:hover,
          .react-calendar-custom .react-calendar__tile:enabled:focus {
            background-color: #374151; /* hover:bg-gray-700 */
          }

          .react-calendar-custom .react-calendar__tile--now {
            background-color: #1e40af; /* bg-blue-700 */
            color: #f3f4f6; /* text-gray-100 */
          }

          .react-calendar-custom .react-calendar__tile--active {
            background-color: #2563eb; /* bg-blue-600 */
            color: #f3f4f6; /* text-gray-100 */
          }

          .react-calendar-custom .react-calendar__tile--active:enabled:hover,
          .react-calendar-custom .react-calendar__tile--active:enabled:focus {
            background-color: #1d4ed8; /* hover:bg-blue-700 */
          }

          /* Event marker styling */
          .event-marker {
            display: flex;
            justify-content: center;
            position: absolute;
            top: 2px;
            left: 0;
            right: 0;
          }

          .event-dot {
            height: 5px;
            width: 5px;
            background-color: #60a5fa; /* text-blue-400 */
            border-radius: 50%;
            display: inline-block;
          }
        `}
      </style>
    </div>
  );
};

export default EventCalendar;
