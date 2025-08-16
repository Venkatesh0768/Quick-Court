// src/pages/Courts.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import NavBar from "../components/NavBar";

function Courts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/courts"); // GET http://localhost:8080/api/v1/courts
        setCourts(res.data || []);
      } catch (err) {
        console.error("Error fetching courts:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading courts...</p>;
  }

  return (
    <div className="w-full h-screen bg-zinc-900">
      <NavBar />
      <div className="flex bg-black text-white min-h-screen">
        {/* Sidebar Filters */}
        <aside className="w-64 bg-gray-900 p-6 space-y-6">
          <h2 className="text-lg font-bold mb-4">Search by venue name</h2>
          <input
            type="text"
            placeholder="Search venues..."
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <div>
            <h2 className="text-lg font-bold mb-2">Filter by Sport Type</h2>
            <select className="w-full p-2 rounded bg-gray-800 text-white">
              <option>All Sports</option>
              <option>Cricket</option>
              <option>Football</option>
              <option>Tennis</option>
              <option>Badminton</option>
            </select>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Price Range (per hour)</h2>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="₹ Min"
                className="w-1/2 p-2 rounded bg-gray-800 text-white"
              />
              <input
                type="number"
                placeholder="₹ Max"
                className="w-1/2 p-2 rounded bg-gray-800 text-white"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Choose Venue Type</h2>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-red-600" />
              <span>Outdoor</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-red-600" />
              <span>Indoor</span>
            </label>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Choose Ratings</h2>
            {[5, 4, 3, 2, 1].map((star) => (
              <label key={star} className="flex items-center space-x-2">
                <input type="checkbox" className="accent-red-600" />
                <span>{star} Stars & up</span>
              </label>
            ))}
          </div>

          <button className="bg-red-600 w-full py-2 rounded font-bold">
            Apply Filters
          </button>
        </aside>

        {/* Courts Grid */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">
            Sports Venues: Discover and Book Nearby
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courts.map((court) => (
              <div
                key={court.id}
                className="bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col"
              >
                <div className="h-32 bg-gray-700 flex items-center justify-center text-gray-400">
                  <img
                    className="w-full h-full object-cover" // ✅ fills container nicely
                    src={court.photoUrl}
                    alt="Court"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-lg font-bold">{court.name}</h2>
                  <p className="text-sm text-gray-400 flex items-center">
                    <FaMapMarkerAlt className="mr-2" />{" "}
                    {court.location || "N/A"}
                  </p>
                  <p className="mt-2 text-sm">{court.sportType}</p>
                  <p className="mt-1 text-sm text-gray-300">
                    ₹ {court.pricePerHour} per hour
                  </p>
                  <div className="flex items-center mt-2 text-yellow-400">
                    <FaStar />{" "}
                    <span className="ml-1">{court.rating || "4.5"}</span>
                  </div>
                  <Link
                    to={`/courtDetails/${court.id}`}
                    className="mt-auto bg-green-600 hover:bg-green-700 text-white font-bold text-center py-2 px-4 rounded-xl"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            <button className="px-3 py-1 rounded bg-gray-800">{"<"}</button>
            <button className="px-3 py-1 rounded bg-red-600">1</button>
            <button className="px-3 py-1 rounded bg-gray-800">2</button>
            <button className="px-3 py-1 rounded bg-gray-800">3</button>
            <button className="px-3 py-1 rounded bg-gray-800">{">"}</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Courts;
