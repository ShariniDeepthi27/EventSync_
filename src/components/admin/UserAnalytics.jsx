import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ff7300",
  "#4CAF50",
  "#9C27B0",
  "#E91E63",
];

const AdminAnalyticsDashboard = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [eventTypesData, setEventTypesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeEventAccessTab, setActiveEventAccessTab] = useState("all");
  const [eventAccessTypes, setEventAccessTypes] = useState(["all"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const deptResponse = await axios.get(
          "http://localhost:8080/api/analytics/departments",
          {
            withCredentials: true,
          }
        );
        setDepartmentData(deptResponse.data);

        const uniqueAccessTypes = [
          "all",
          ...new Set(deptResponse.data.map((dept) => dept.name)),
        ];
        setEventAccessTypes(uniqueAccessTypes);

        const eventResponse = await axios.get(
          "http://localhost:8080/api/analytics/events",
          {
            withCredentials: true,
          }
        );
        setEventData(eventResponse.data);

        const eventTypesResponse = await axios.get(
          "http://localhost:8080/api/analytics/event-types",
          {
            withCredentials: true,
          }
        );
        setEventTypesData(eventTypesResponse.data);

        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch analytics data");
        setIsLoading(false);
        console.error("Error fetching analytics data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 500000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents =
    activeEventAccessTab === "all"
      ? eventData
      : eventData.filter((event) => event.eventAccess === activeEventAccessTab);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
   
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000000"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${departmentData[index]?.name}`}
      </text>
    );
  };

  const StatCard = ({ title, value, description, icon }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">{icon}</div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">
            Loading analytics data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Admin Analytics Dashboard
      </h1>

      <div className="mb-6">
        <StatCard
          title="Total Users"
          value={departmentData.reduce((sum, dept) => sum + dept.value, 0)}
          description={`Across ${departmentData.length} departments`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Events"
          value={eventData.length}
          description={`${eventData.filter((e) => new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} in the last week`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />
        <StatCard
          title="Average Attendance"
          value={eventData.reduce((sum, event) => sum + event.attended, 0)}
          description="Of registered users"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Registrations"
          value={eventData.reduce((sum, event) => sum + event.registered, 0)}
          description="Across all events"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          User Distribution by Department
        </h2>
        <div className="h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomizedLabel}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} users`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Event Types Distribution
        </h2>
        <div className="h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={eventTypesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} `
                }
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {eventTypesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} events`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Event Performance Details
          </h2>

          <div className="relative">
            <select
              value={activeEventAccessTab}
              onChange={(e) => setActiveEventAccessTab(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              {eventAccessTypes.map((accessType) => (
                <option key={accessType} value={accessType}>
                  {accessType === "all" ? "All Events" : accessType}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Event Name</th>
                <th className="px-6 py-3">Event Type</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Registered</th>
                <th className="px-6 py-3">Attended</th>
                <th className="px-6 py-3">Attendance Rate</th>
                <th className="px-6 py-3">Likes</th>
                <th className="px-6 py-3">Comments</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">{event.name}</td>
                  <td className="px-6 py-4">{event.eventAccess}</td>
                  <td className="px-6 py-4">{event.date}</td>
                  <td className="px-6 py-4">{event.registered}</td>
                  <td className="px-6 py-4">{event.attended}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${(event.attended / event.registered) * 100 || 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2">
                        {event.attended || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{event.likes || 0}</td>
                  <td className="px-6 py-4">{event.comments || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No events found for the selected category.
          </div>
        )}

        {filteredEvents.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              {activeEventAccessTab === "all"
                ? "All Events"
                : activeEventAccessTab}{" "}
              Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Total Events</div>
                <div className="text-xl font-bold">{filteredEvents.length}</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Total Registrations</div>
                <div className="text-xl font-bold">
                  {filteredEvents.reduce(
                    (sum, event) => sum + event.registered,
                    0
                  )}
                </div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">Total Attendance</div>
                <div className="text-xl font-bold">
                  {filteredEvents.reduce(
                    (sum, event) => sum + event.attended,
                    0
                  )}
                </div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-500">
                  Avg. Attendance Rate
                </div>
                <div className="text-xl font-bold">
                  {filteredEvents.reduce((sum, event) => sum + event.attended, 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
