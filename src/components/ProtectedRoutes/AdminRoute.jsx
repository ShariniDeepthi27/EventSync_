// components/ProtectedRoutes/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
