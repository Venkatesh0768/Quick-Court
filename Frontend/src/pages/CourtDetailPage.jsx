import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../utils/axios";

function CourtDetailPage() {
  const { courtId } = useParams();
  const [court, setCourt] = useState(null);
  const [facility, setFacility] = useState(null);
  const [reviews, setReviews] = useState([]);

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

          // fetch reviews for this facility
          const reviewsRes = await axiosInstance.get(
            `/reviews/facility/${response.data.facilityId}`
          );
          setReviews(reviewsRes.data);
        }
      } catch (error) {
        console.error("Error fetching court details:", error);
      }
    };

    fetchCourt();
  }, [courtId]);

  console.log(court);

  if (!court) {
    return (
      <div className="w-full h-screen bg-zinc-900 flex justify-center items-center text-white">
        Loading court details...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white">
      <NavBar />

      {/* Court Header */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{facility?.name || "Court"}</h1>
            <p className="text-gray-400">
              {facility?.address || "No address available"}
            </p>
            <p className="text-sm mt-1">
              <span className="text-yellow-400">
                ★{" "}
                {reviews.length > 0
                  ? (
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </span>{" "}
              ({reviews.length} Reviews)
            </p>
          </div>

          <button className="bg-green-500 px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition">
            Book This Venue
          </button>
        </div>

        {/* Court Info */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-zinc-800 h-[300px] rounded-lg flex justify-center items-center overflow-hidden">
            <img
              className="w-full h-full object-cover" // ✅ fills container nicely
              src={court.photoUrl}
              alt="Court"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Operating Hours</h2>
              <p>{court.operatingHours}</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Address</h2>
              <p>{facility?.address || "N/A"}</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Price</h2>
              <p>₹{court.pricePerHour} / hour</p>
            </div>
          </div>
        </div>

        {/* Sports & Services */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Sports Available</h2>
          <div className="flex gap-3">
            <span className="px-4 py-2 bg-green-600 rounded-lg text-sm font-medium">
              {court.sportType}
            </span>
          </div>
        </div>

        {/* About Venue */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">About Venue</h2>
          <p className="text-gray-400">
            {facility?.description ||
              "This is a premium sports facility offering great courts and amenities for players."}
          </p>
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Player Reviews & Ratings</h2>
          {reviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-zinc-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{review.userName || "User"}</p>
                    <p className="text-yellow-400">
                      {"★".repeat(review.rating)}{" "}
                      <span className="text-gray-500 text-sm">
                        ({review.rating})
                      </span>
                    </p>
                  </div>
                  <p className="text-gray-400 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        {/* Booking Button */}
        <div className="mt-10 flex justify-center">
          <Link
            to={`/booking/${court.id}`}
            className="bg-green-500 px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Proceed to Booking
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourtDetailPage;
