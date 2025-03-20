import React, { useEffect, useState } from "react";
import axios from "axios";
import { checkAuth } from "../../apis/api";
// import { useAuth } from "../../context/authContext";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", dept: "", email: "" });
  const [userId, setUserId] = useState(null);
  // const { refreshUser } = useAuth();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const authStatus = await checkAuth();
        if (authStatus.isAuthenticated && authStatus.user) {
          setUserId(authStatus.user._id);
        } else {
          setError("User is not authenticated.");
          setLoading(false);
        }
      } catch (err) {
        setError("Error authenticating user.");
        setLoading(false);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/auth/${userId}`
        );
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          dept: userData.department || "",
          email: userData.email || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Error fetching user data.");
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSave = async () => {
   try {
     await axios.put(
       `http://localhost:8080/api/auth/update/${userId}`,
       formData
     );
     const updatedResponse = await axios.get(
       `http://localhost:8080/api/auth/${userId}`
     );
     setUser(updatedResponse.data.user);
    //  refreshUser();
     setEditing(false);
   } catch (err) {
     console.error(
       "Update error:",
       err.response ? err.response.data : err.message
     );
     setError("Error updating user data.");
   }
 };


  if (loading)
    return (
      <div className="text-center text-blue-400 text-lg py-8">Loading...</div>
    );
  if (error)
    return <div className="text-center text-red-500 text-lg py-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-16 max-w-4xl mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-white">
        User Profile
      </h1>
      <div className="space-y-4">
        <div>
          <strong className="text-lg text-blue-400">Name:</strong>
          {editing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-700 p-2 w-full rounded-lg bg-gray-700 text-white mt-1"
            />
          ) : (
            <p className="text-gray-300 mt-1">{user.name}</p>
          )}
        </div>
        <div>
          <strong className="text-lg text-blue-400">Department:</strong>
          {editing ? (
            <select
              name="dept"
              value={formData.dept}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 rounded-md bg-gray-700 text-white"
            >
              <option value="">Select Department</option>
              <option value="Product">Product</option>
              <option value="Intern">Intern</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          ) : (
            <p className="text-gray-300 mt-1">{user.department}</p>
          )}
        </div>
        <div>
          <strong className="text-lg text-blue-400">Email:</strong>
          <p className="text-gray-300 mt-1">{user.email}</p>
        </div>
      </div>
      <div className="mt-6 text-center">
        {editing ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
