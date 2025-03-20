import { useAuth } from "../../context/authContext";

const LogoutButton = () => {
  const { handleLogout } = useAuth();

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
