import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/Auth/AuthSlice";
import { FiCalendar, FiLogIn, FiLogOut, FiUser, FiPlusCircle, FiHome, FiSettings } from "react-icons/fi";
import { motion } from "framer-motion";

function NavBar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return (
    <nav className="w-full bg-gray-800 border-b border-gray-700 px-4 md:px-8 lg:px-12 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              QuickCourt
            </span>
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Owner-specific links */}
          {role === "OWNER" && (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/myfacilities" 
                  className="hidden md:flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FiHome className="text-green-400" />
                  My Facilities
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/createfacility" 
                  className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FiPlusCircle />
                  Create Facility
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/adminpanel" 
                  className="hidden md:flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FiSettings className="text-blue-400" />
                  Admin Panel
                </Link>
              </motion.div>
            </>
          )}

          {/* Bookings Link */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/bookings"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <FiCalendar />
              <span className="hidden sm:inline">Bookings</span>
            </Link>
          </motion.div>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile Owner Menu */}
              {role === "OWNER" && (
                <div className="md:hidden relative group">
                  <button className="p-2 rounded-full bg-gray-700 text-white">
                    <FiSettings />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-700">
                    <Link
                      to="/myfacilities"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      My Facilities
                    </Link>
                    <Link
                      to="/createfacility"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Create Facility
                    </Link>
                    <Link
                      to="/adminpanel"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Admin Panel
                    </Link>
                  </div>
                </div>
              )}

              {/* User Profile */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg transition-all"
                  title="Profile"
                >
                  {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
                </Link>
              </motion.div>

              {/* Logout Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => dispatch(logout())}
                  className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </motion.div>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <FiLogIn />
                <span className="hidden sm:inline">Login / SignUp</span>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;