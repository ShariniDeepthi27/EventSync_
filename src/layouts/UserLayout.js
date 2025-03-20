import { Outlet } from "react-router-dom";
import Navbar from "../components/user/NavBar";

const UserLayout = () => {
 return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar key="navbar" />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
);
}

export default UserLayout;
