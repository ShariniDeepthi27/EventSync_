import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/user/Signup";
import Login from "./components/user/Login";
import Calendar from "./components/user/Calendar";
import UserFirstPage from "./components/user/UserFirstPage";
import { AuthProvider } from "./context/authContext";
import DashBoard from "./components/admin/EventDashBoard";
import AdminSidebar from "./components/admin/AdminSidebar";
import CreateEvent from "./components/admin/createEvent";
import AuthPage from "./components/user/Authpage";
import UserNavbar from "./components/user/NavBar";
import UserActivity from "./components/user/UserActivity";
import EditProfile from "./components/user/EditProfile";
import Profile from "./components/user/Profile";
import NotFound from "./components/NotFound";
import EventFullpage from "./components/admin/Eventfullpage";
import AdminDashboard from "./components/admin/AdminDash";
import MainPage from "./components/main_page";
import QRReader from "./components/qr/QrReader";
import QRgenerator from "./components/qr/QrGenerator";
// import EventDetails from "./components/user/EventFullPage";
import AdminAnalyticsDashboard from "./components/admin/UserAnalytics";
// import Notifications from "./components/user/Notifications";
import MainPageLayout from "./layouts/MainPageLayout";
import UserLayout from "./layouts/UserLayout";
import Intro from "./components/admin/Intro";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";
import AdminRoute from "./components/ProtectedRoutes/AdminRoute";
import UserRoute from "./components/ProtectedRoutes/UserRoute";
import EventFullPaged from "./components/user/EventFullPaged";
import CommentSection from "./components/user/CommentSection";
import SendInvite from "./components/admin/SendInvite"
function App() {
  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes accessible to everyone */}
          <Route path="/" element={<MainPageLayout />}>
            <Route path="/mainpage" element={<MainPage/>}/>
            <Route index element={<Signup />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            <Route path="reset-password/:token" element={<ResetPassword />} />
            
          </Route>

          {/* Admin routes - only accessible to admins */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminSidebar />}>
              <Route path="intro" element={<Intro />} />
              {/* <Route path="dummyanalytics" element={<AnalyticsDashboard/>}/> */}

              <Route path="createevent" element={<CreateEvent />} />
              <Route path="dashboard" element={<DashBoard />} />
              <Route path="admindashboard" element={<AdminDashboard />} />
              {/* <Route path="users" element={<UserAnalytics />} /> */}
              <Route path="analytics" element={<AdminAnalyticsDashboard />} />
              <Route path="sendinvite/:eventId" element={<SendInvite/>}/>
              <Route path="event/:eventId" element={<EventFullpage />} />
              <Route path="qrread" element={<QRReader />} />
            </Route>
          </Route>

          {/* User routes - only accessible to users */}
          <Route element={<UserRoute />}>
            <Route path="/" element={<UserLayout />}>
              <Route path="qrgen" element={<QRgenerator />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="your-activity" element={<UserActivity />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="userfirstpage" element={<UserFirstPage />} />
              <Route path="usernavbar" element={<UserNavbar />} />
              {/* <Route path="notifications" element={<Notifications />} /> */}
              <Route path="comments" element={<CommentSection />} />

              <Route path="/eventf/:id" element={<EventFullPaged />} />
            
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;
