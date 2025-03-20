// components/ProtectedRoutes/UserRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const UserRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user && user.role === "user" ? <Outlet /> : <Navigate to="/login" />;
};

export default UserRoute;
