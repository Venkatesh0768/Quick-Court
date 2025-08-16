import React from "react";
import { Link } from "react-router-dom";

function VenuCard({ court, facility }) {
   console.log(court);
   

  return (
    <div className="w-[300px] rounded-2xl flex-shrink-0 overflow-hidden text-white bg-zinc-900">
      {/* Image */}
      <div className="h-40 bg-zinc-700 flex justify-center items-center overflow-hidden">
        <img
          src={
            court.photoUrl ||
            "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          }
          alt={court.name || "Court Image"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Court Info */}
      <div className="bg-zinc-800 flex justify-between px-5 py-3 items-center">
        <h1 className="text-2xl font-semibold">{court.sportType}</h1>
        <Link className="px-2 py-1 bg-green-500 rounded">4.8 (16)</Link>
      </div>

      {/* Address */}
      <p className="flex gap-2 px-5 py-2">
        <i className="ri-map-pin-2-line"></i>
        {facility?.address || "Address not available"}
      </p>

      {/* Tags */}
      <div className="flex gap-2 px-3 py-2 items-center">
        <h1 className="bg-zinc-600 px-3 py-1 rounded-full">Top Rated</h1>
        <h1 className="bg-zinc-600 px-3 py-1 rounded-full">Rated</h1>
        <h1 className="bg-zinc-600 px-3 py-1 rounded-full">Budget</h1>
      </div>

      {/* Button */}
      <div className="w-full flex justify-center p-3">
        <Link
          to={`/courtDetails/${court.id}`}
          className="w-full text-xl font-semibold rounded bg-green-700 py-3 flex items-center justify-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default VenuCard;
