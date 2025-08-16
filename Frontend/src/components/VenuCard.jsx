import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

function VenuCard({ court, facility }) {
  return (
    <div className="w-full max-w-[320px] rounded-xl overflow-hidden text-white bg-zinc-800 shadow-lg hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col">
      {/* Image with Rating Badge */}
      <div className="h-48 bg-zinc-700 relative overflow-hidden">
        <img
          src={
            court.photoUrl ||
            "https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
          }
          alt={court.name || "Court Image"}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 px-2 py-1 rounded-full flex items-center">
          <FaStar className="text-yellow-400 mr-1 text-sm" />
          <span className="text-white text-sm">4.8 (16)</span>
        </div>
      </div>

      {/* Court Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold line-clamp-1">{court.sportType}</h1>
          <span className="text-green-400 font-medium">
            ₹{court.pricePerHour || "?"}/hr
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mb-3 text-gray-300">
          <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-green-500" />
          <p className="text-sm line-clamp-2">
            {facility?.address || "Address not available"}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["Top Rated", "Indoor", "Lighting"].map((tag) => (
            <span
              key={tag}
              className="bg-zinc-700 text-xs px-3 py-1 rounded-full hover:bg-green-600 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Button */}
        <Link
          to={`/courtDetails/${court.id}`}
          className="mt-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors duration-200 flex items-center justify-center gap-2"
        >
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default VenuCard;