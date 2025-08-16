import React from "react";
import NavBar from "../components/NavBar";
import VenuCard from "../components/VenuCard";

function FacilityPage() {
  return (
    <div className="w-full min-h-screen bg-zinc-900 overflow-hidden flex flex-col">
      <NavBar />

      {/* Header */}
      <div className="w-full h-[88px] text-4xl text-white flex justify-center items-center border-b-2 border-t-2 border-white">
        <h1>Sport Venues in Ahmedabad — Discover and Book Nearby Venues</h1>
      </div>

      <div className="w-full flex flex-grow divide-x-2 divide-white">
        <div className="w-[20%] h-full bg-zinc-800"></div>

        <div className="w-[80%] p-10 flex gap-5 flex-wrap overflow-y-auto  border-l-1 border-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <VenuCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FacilityPage;
