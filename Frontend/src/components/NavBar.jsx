import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/Auth/AuthSlice";

function NavBar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const user  = useSelector((state) => state.auth.user)

  return (
    <div className="w-full h-22  flex justify-between px-20 items-center">
      <h1 className="text-white text-4xl font-bold">Quick Court</h1>
      <div className="flex justify-center items-center gap-3">
        <Link
          to="/booking"
          className="text-white gap-2 font-bold flex text-xl bg-green-600 py-2 px-4 rounded-3xl"
        >
          <i className="ri-calendar-check-line"></i>
          Booking
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="hover:bg-blue-600 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold"
            >
              {user?.lastName?.[0] || "U"}
            </Link>
            <button
              onClick={() => dispatch(logout())} 
              className="bg-red-600 text-white px-4 py-2 rounded-3xl hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-white gap-2 font-bold flex text-xl bg-blue-600 py-2 px-4 rounded-3xl"
          >
            <i className="ri-login-circle-fill"></i>
            Login / SignUp
          </Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;