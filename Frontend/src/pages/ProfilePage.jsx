import React from "react";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import UserProfileCard from "../components/UserProfileCard";
import { FiUser, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

function ProfilePage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-3xl text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Authentication Required</h2>
          <p className="text-gray-400 mb-6">
            You need to be logged in to view your profile.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = "/login"}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <FiUser className="text-blue-400 text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card - Takes full width on mobile, 1/3 on desktop */}
            <div className="lg:col-span-1">
              <UserProfileCard user={user} />
            </div>

            {/* Additional Content Section - Hidden on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full">
                <h2 className="text-xl font-semibold text-white mb-4">Activity Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Upcoming</p>
                    <p className="text-2xl font-bold text-white">3</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Favorites</p>
                    <p className="text-2xl font-bold text-white">5</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-2xl font-bold text-white">
                      {new Date(user.createdAt).toLocaleDateString('default', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/50">
                        <p className="text-gray-300 text-sm">Booking confirmed at Sports Arena</p>
                        <p className="text-gray-500 text-xs">2 days ago</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;