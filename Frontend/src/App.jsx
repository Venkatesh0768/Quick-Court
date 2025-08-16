import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OtpPage from "./pages/OtpPage";
import ProfilePage from "./pages/ProfilePage";
import FacilityPage from "./pages/CourtsPage";
import CreateFacility from "./pages/CreateFacility";
import MyFacility from "./pages/MyFacility";
import CourtDetailPage from "./pages/CourtDetailPage";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import AdminPanel from "./pages/AdminPanle";
import CreateCourtPage from "./pages/CreateCourtPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/send/otp" element={<OtpPage />}></Route>
        <Route path="/courts" element={<FacilityPage />}></Route>
        <Route path="/createfacility" element={<CreateFacility />}></Route>
        <Route path="/createcourt" element={<CreateCourtPage />}></Route>
        <Route path="/myfacilities" element={<MyFacility />}></Route>
        <Route
          path="/courtDetails/:courtId"
          element={<CourtDetailPage />}
        ></Route>
        <Route path="/booking/:courtId" element={<BookingPage />}></Route>
        <Route path="/bookings" element={<MyBookings />}></Route>
        <Route path="/adminpanel" element={<AdminPanel />}></Route>
      </Routes>
    </div>
  );
}

export default App;
