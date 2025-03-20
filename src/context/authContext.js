import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth, logout } from "../apis/api";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

 useEffect(() => {
   const verifySession = async () => {
     try {
       setLoading(true);
       const res = await checkAuth();
       console.log("Auth Check:", res);

       if (res.isAuthenticated) {
         setUser(res.user);
       } else {
         setUser(null);
         // Redirect only if user is NOT on authentication-related pages
         if (
           !["/mainpage",
             "/login",
             "/signup",
             "/forgot-password",
             `/reset-password/${location.pathname.split("/").pop()}`,
           ].includes(location.pathname)
         ) {
           navigate("/login"); // Redirect to login instead of forgot-password
         }
       }
     } catch (error) {
       console.error("Error verifying session:", error);
       setUser(null);
       navigate("/login"); // Redirect in case of an error
     } finally {
       setLoading(false);
     }
   };

   verifySession();
 }, [navigate, location.pathname]);


  const handleLogout = async () => {
    await logout();
    setUser(null);
    setTimeout(() => navigate("/login"), 100); // Ensure state updates before navigation
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
