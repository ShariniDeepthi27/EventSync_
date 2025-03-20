import React, { useEffect, useState } from "react";
import axios from "axios";

const EventList = ({ date }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/events/${date}`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [date]);

  return (
    <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-100">
      <h3 className="text-lg font-bold mb-2">Events on {date}</h3>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : events.length > 0 ? (
        <ul className="list-disc pl-5">
          {events.map((event, index) => (
            <li key={index} className="text-gray-700">{event}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No events for this day.</p>
      )}
    </div>
  );
};

export default EventList;
