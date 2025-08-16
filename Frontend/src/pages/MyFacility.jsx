import React, { useEffect, useState } from "react";
import VenuCard from "../components/VenuCard";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import { Link } from "react-router-dom";

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
      <div className="w-full min-h-screen bg-zinc-900 flex flex-col">
        <NavBar />
        <div className="flex-grow flex justify-center items-center">
          <h1 className="text-white text-2xl">Loading your venues...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-zinc-900 flex flex-col">
        <NavBar />
        <div className="flex-grow flex justify-center items-center">
          <h1 className="text-red-500 text-2xl">{error}</h1>
        </div>
      </div>
    );
  }
  console.log(selectedFacility);

  return (
    <div className="w-full min-h-screen bg-zinc-900 overflow-hidden flex flex-col">
      <NavBar />

      <div className="w-full h-[88px] text-4xl text-white flex justify-center items-center border-b-2 border-t-2 border-white text-center px-4">
        <h1 className="w-[90%]">My Sport Venues</h1>
        {selectedFacility && (
          <Link
            to="/createcourt"
            state={{ facilityId: selectedFacility.id }}
            className="w-[10%] text-2xl bg-yellow-600 p-3 rounded font-bold cursor-pointer text-center"
          >
            Create a Court
          </Link>
        )}
      </div>

      <div className="w-full flex flex-grow divide-x-2 divide-white">
        {/* Facilities list */}
        <div className="w-[20%] h-full p-3 overflow-y-auto">
          {facilities.length > 0 ? (
            facilities.map((facility) => (
              <button
                key={facility.id}
                onClick={() => setSelectedFacility(facility)}
                className={`w-full h-20 mb-3 rounded-xl flex justify-center items-center 
                  ${
                    selectedFacility?.id === facility.id
                      ? "bg-green-700"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  } 
                  text-center`}
              >
                <h1 className="text-white font-semibold text-2xl">
                  {facility.name || "Unnamed Facility"}
                </h1>
              </button>
            ))
          ) : (
            <p className="text-white p-4">You don't own any facilities yet.</p>
          )}
        </div>

        {/* Courts of selected facility */}
        <div className="w-[80%] p-10 flex gap-5 flex-wrap overflow-y-auto border-l border-white">
          {selectedFacility && selectedFacility.courts?.length > 0 ? (
            selectedFacility.courts.map((court) => (
              <VenuCard
                key={court.id}
                court={court}
                facility={selectedFacility}
              />
              
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <p className="text-white text-xl">
                No courts found for this facility.
              </p>
              <p className="text-zinc-400 mt-2">
                Add a court to this facility to see it here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyFacility;
