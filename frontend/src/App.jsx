import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signUp/SignUpPage";
import LoginPage from "./pages/auth/Login/LoginPage";
import Sidebar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

export default function App() {
  return (
   <div className="flex max-w-6xl mx-auto">
    <Sidebar/>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<NotificationPage/>} />
        <Route path="/profile/:username" element={<ProfilePage/>}/>
        <Route path="*" element={<HomePage />} />
    </Routes>
    <RightPanel/>
   </div>
  )
}