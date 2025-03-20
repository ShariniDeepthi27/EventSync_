import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  withCredentials: true,
});

export const signup = (userData) => API.post("/signup", userData);

export const login = (userData) => API.post("/login", userData);

export const logout = () => API.post("/logout");

export const getUserDeptByEmail = (email) =>
  API.get(`/getUserDeptByEmail/${email}`);

export const checkAuth = async () => {
  try {
    const response = await API.get("/check");
    return response.data;
  } catch {
    return { isAuthenticated: false };
  }
};
