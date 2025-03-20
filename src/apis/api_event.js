import axios from "axios";

const API_URL = "http://localhost:8080/events";

export const createEvent = async (eventData) => {
 

  const response = await axios.post(`${API_URL}/create`, eventData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials:true
  });
  console.log(response.data);
  return response.data; 
};
export const createNotification=async (notificationData) => {
  const response = await axios.post(`${API_URL}/notifications`, notificationData);
  console.log(response.data);
  return response.data;}
export const fetchEventsByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_URL}/filter?status=${status.toLowerCase()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
export const getEventById = async (eventId) => {
  try{
    const response= await axios.get(`${API_URL}/${eventId}`);
    return response.data;
  }
  catch(err){
    console.log(err);
    throw err;
  }

}
export const updateEvent = async (eventId, updatedData) => {
  try {
    let headers = {};

    if (!(updatedData instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await axios.put(`${API_URL}/${eventId}`, updatedData, {
      headers,
      withCredentials:true
  });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating event:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const likeEvent = async (eventId) => {
  try {
    const response = await axios.post(`${API_URL}/${eventId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error liking event:", error);
    throw error;
  }
};

export const saveEvent = async (eventId) => {
  try {
    const response = await axios.post(`${API_URL}/${eventId}/save`);
    return response.data;
  } catch (error) {
    console.error("Error saving event:", error);
    throw error;
  }
};

export const addComment = async (eventId, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/${eventId}/comment`, commentData);
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getComments = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/${eventId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
export const getEventByDate = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/geteventbydate?date=${date}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching event by date:", error);
    throw error;
  }
};
