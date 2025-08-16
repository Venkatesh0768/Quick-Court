import React from "react";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import UserProfileCard from "../components/UserProfileCard";

function ProfilePage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-400">
            You need to be logged in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-900">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <UserProfileCard user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
