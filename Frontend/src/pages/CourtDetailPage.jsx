import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../utils/axios";
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

function CourtDetailPage() {
  const { courtId } = useParams();
  const [court, setCourt] = useState(null);
  const [facility, setFacility] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const response = await axiosInstance.get(`/courts/${courtId}`);
        setCourt(response.data);

        if (response.data.facilityId) {
          const facilityRes = await axiosInstance.get(
            `/facilities/${response.data.facilityId}`
          );
          setFacility(facilityRes.data);

          const reviewsRes = await axiosInstance.get(
            `/reviews/facility/${response.data.facilityId}`
          );
          setReviews(reviewsRes.data);
        }
      } catch (error) {
        console.error("Error fetching court details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourt();
  }, [courtId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-zinc-900 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center text-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-green-600 rounded-full mb-4"></div>
            <p>Loading court details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="w-full min-h-screen bg-zinc-900 flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center text-white">
          <div className="text-center">
            <p className="text-xl mb-4">Court not found</p>
            <Link
              to="/courts"
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition duration-200"
            >
              Browse Available Courts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white">
      <NavBar />

      {/* Court Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {facility?.name || "Court"}
              </h1>
              <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full">
                {court.sportType}
              </span>
            </div>
            <div className="flex items-center text-gray-400 mb-3">
              <FaMapMarkerAlt className="mr-2 text-green-500" />
              <p>{facility?.address || "No address available"}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-zinc-800 px-3 py-1 rounded-full">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{averageRating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm ml-1">
                  ({reviews.length})
                </span>
              </div>
              <div className="flex items-center bg-zinc-800 px-3 py-1 rounded-full">
                <FaMoneyBillWave className="text-green-500 mr-1" />
                <span>₹{court.pricePerHour}/hour</span>
              </div>
            </div>
          </div>

          <Link
            to={`/booking/${court.id}`}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2 w-full md:w-auto justify-center"
          >
            Book Now <IoIosArrowForward />
          </Link>
        </div>

        {/* Court Gallery */}
        <div className="mt-8 bg-zinc-800 rounded-xl overflow-hidden h-64 sm:h-80 w-full">
          <img
            className="w-full h-full object-cover"
            src={
              court.photoUrl ||
              "https://via.placeholder.com/800x400?text=Court+Image"
            }
            alt="Court"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x400?text=Court+Image";
            }}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-700 mt-8">
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "overview"
                ? "text-green-400 border-b-2 border-green-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "amenities"
                ? "text-green-400 border-b-2 border-green-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("amenities")}
          >
            Amenities
          </button>
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === "reviews"
                ? "text-green-400 border-b-2 border-green-500"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-zinc-800 p-5 rounded-xl">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaClock className="text-green-500" />
                    Operating Hours
                  </h2>
                  <p className="text-gray-300">
                    {court.operatingHours || "Not specified"}
                  </p>
                </div>

                <div className="bg-zinc-800 p-5 rounded-xl">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-500" />
                    Location Details
                  </h2>
                  <p className="text-gray-300">{facility?.address || "N/A"}</p>
                  {facility?.landmark && (
                    <p className="text-gray-400 mt-2">
                      Landmark: {facility.landmark}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-zinc-800 p-5 rounded-xl">
                <h2 className="text-xl font-bold mb-4">About This Venue</h2>
                <p className="text-gray-300">
                  {facility?.description ||
                    "This premium sports facility offers excellent courts and amenities for players of all skill levels. The venue is well-maintained and provides a great environment for sports enthusiasts."}
                </p>
              </div>
            </div>
          )}

          {activeTab === "amenities" && (
            <div className="bg-zinc-800 p-5 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Facility Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  "Changing Rooms",
                  "Showers",
                  "Parking",
                  "Equipment Rental",
                  "Water Station",
                  "Seating Area",
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {reviews.length > 0 ? (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-zinc-800 p-5 rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-900 w-10 h-10 rounded-full flex items-center justify-center">
                            <FaUser className="text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {review.userName || "Anonymous"}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center bg-green-900 bg-opacity-30 px-2 py-1 rounded">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-500"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mt-3">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-zinc-800 p-8 rounded-xl text-center">
                  <p className="text-gray-400 mb-4">
                    No reviews yet for this venue
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition duration-200">
                    Be the first to review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixed Booking Button (Mobile) */}
        <div className="md:hidden fixed bottom-4 left-0 right-0 px-4">
          <Link
            to={`/booking/${court.id}`}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg block text-center transition duration-200"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourtDetailPage;
