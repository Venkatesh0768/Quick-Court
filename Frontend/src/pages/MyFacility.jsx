import React, { useEffect, useState } from "react";
import VenuCard from "../components/VenuCard";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import { Link } from "react-router-dom";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function MyFacility() {
  const user = useSelector((state) => state.auth.user);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchFacilities = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get(`/users/${user.id}`);
        const data = response.data.ownedFacilities || [];
        setFacilities(data);

        if (data.length > 0) {
          setSelectedFacility(data[0]);
        }
      } catch (err) {
        console.error("Error fetching user facilities:", err);
        setError("Could not load your facilities. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col">
        <NavBar />
        <div className="flex-grow flex flex-col justify-center items-center gap-4">
          <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
          <h1 className="text-white text-2xl font-medium">
            Loading your venues...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col">
        <NavBar />
        <div className="flex-grow flex flex-col justify-center items-center gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-red-500 text-2xl font-medium">{error}</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col">
      <NavBar />

      <div className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-white">My Sport Venues</h1>
          
          {selectedFacility && (
            <Link
              to="/createcourt"
              state={{ facilityId: selectedFacility.id }}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-4 py-3 rounded-lg font-semibold transition-all"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create a Court</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-grow divide-y lg:divide-y-0 lg:divide-x divide-zinc-700">
        {/* Facilities list */}
        <div className="w-full lg:w-1/4 p-4 overflow-y-auto max-h-[60vh] lg:max-h-none">
          <h2 className="text-xl font-semibold text-white mb-4 px-2">
            Your Facilities
          </h2>
          
          {facilities.length > 0 ? (
            <div className="space-y-3">
              {facilities.map((facility) => (
                <motion.button
                  key={facility.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFacility(facility)}
                  className={`w-full p-4 rounded-xl transition-all ${
                    selectedFacility?.id === facility.id
                      ? "bg-gradient-to-r from-green-700 to-green-600 shadow-lg"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  <h2 className="text-white font-medium text-lg text-left">
                    {facility.name || "Unnamed Facility"}
                  </h2>
                  <p className="text-zinc-400 text-sm mt-1 text-left">
                    {facility.courts?.length || 0} courts
                  </p>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-800/50 rounded-xl p-6 text-center">
              <p className="text-white mb-2">You don't own any facilities yet.</p>
              <Link
                to="/create-facility" // Update this to your actual create facility route
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Create your first facility
              </Link>
            </div>
          )}
        </div>

        {/* Courts of selected facility */}
        <div className="w-full lg:w-3/4 p-4 lg:p-6 overflow-y-auto">
          {selectedFacility ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedFacility.name || "Unnamed Facility"}
                </h2>
                <p className="text-zinc-400">
                  {selectedFacility.courts?.length || 0} courts
                </p>
              </div>

              {selectedFacility.courts?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedFacility.courts.map((court) => (
                    <motion.div
                      key={court.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VenuCard court={court} facility={selectedFacility} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-zinc-800/50 rounded-xl p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-medium text-white mb-2">
                      No courts found
                    </h3>
                    <p className="text-zinc-400 mb-6">
                      This facility doesn't have any courts yet.
                    </p>
                    <Link
                      to="/createcourt"
                      state={{ facilityId: selectedFacility.id }}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <PlusCircle className="h-5 w-5" />
                      Add Your First Court
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-zinc-800/50 rounded-xl p-8 text-center h-full flex items-center justify-center">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">
                  No facility selected
                </h3>
                <p className="text-zinc-400 mb-6">
                  {facilities.length > 0
                    ? "Select a facility to view its courts"
                    : "Create your first facility to get started"}
                </p>
                {facilities.length === 0 && (
                  <Link
                    to="/create-facility" // Update this to your actual create facility route
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <PlusCircle className="h-5 w-5" />
                    Create Facility
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyFacility;