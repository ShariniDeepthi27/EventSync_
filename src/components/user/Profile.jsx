import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
export default function ProfilePage() {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-16">
    
      <div className="max-w-lg mx-auto mt-14 p-8 bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Profile
        </h2>
        <div className="space-y-6">
          <button
            onClick={() => navigate("/qrgen")}
            className="w-full py-3 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition duration-300"
          >
            QR Code
          </button>
          <button
            onClick={() => navigate("/edit-profile")}
            className="w-full py-3 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/your-activity")}
            className="w-full py-3 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Your Activity
          </button>
          <button
            onClick={handleForgotPassword}
            className="w-full py-3 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Forgot Password
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
