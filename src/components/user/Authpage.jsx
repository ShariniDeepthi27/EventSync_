import { Link } from "react-router-dom";

const AuthPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <p className="text-gray-600 mb-6">Sign up or log in to continue</p>
        <div className="space-y-4">
          <Link to="/login" className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Log In
          </Link>
          <Link to="/signup" className="block w-full text-center bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
