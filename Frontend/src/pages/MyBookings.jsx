import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import NavBar from "../components/NavBar";

function MyBookings() {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("myBookings");
  const [myBookings, setMyBookings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [courtBookings, setCourtBookings] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserDetails = async () => {
      try {
        const res = await axiosInstance.get(`/users/${user.id}`);

        // My own bookings (as USER)
        setMyBookings(res.data.bookings || []);

        // My reviews
        setMyReviews(res.data.reviews || []);

        // Court bookings (as OWNER)
        const facilities = res.data.ownedFacilities || [];
        const allCourtBookings = [];

        facilities.forEach((facility) => {
          facility.courts.forEach((court) => {
            court.bookings.forEach((booking) => {
              allCourtBookings.push({
                courtName: court.name,
                sportType: court.sportType,
                pricePerHour: court.pricePerHour,
                ...booking,
              });
            });
          });
        });

        setCourtBookings(allCourtBookings);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white">
      <NavBar />

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-zinc-800 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">My Account</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 rounded-l-lg ${
              activeTab === "myBookings"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => setActiveTab("myBookings")}
          >
            My Bookings
          </button>
          <button
            className={`px-6 py-2 ${
              activeTab === "myReviews"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => setActiveTab("myReviews")}
          >
            My Reviews
          </button>
          {user?.role === "OWNER" && (
            <button
              className={`px-6 py-2 rounded-r-lg ${
                activeTab === "courtBookings"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setActiveTab("courtBookings")}
            >
              Court Bookings
            </button>
          )}
        </div>

        {/* My Bookings */}
        {activeTab === "myBookings" && (
          <div>
            {myBookings.length === 0 ? (
              <p className="text-center text-gray-400">No bookings found.</p>
            ) : (
              <ul className="space-y-4">
                {myBookings.map((b) => (
                  <li
                    key={b.id}
                    className="p-4 border border-zinc-700 rounded-lg bg-zinc-700"
                  >
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(b.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Start:</strong> {b.startTime} | <strong>End:</strong>{" "}
                      {b.endTime}
                    </p>
                    <p>
                      <strong>Status:</strong> {b.status}
                    </p>
                    <p>
                      <strong>Payment:</strong> {b.paymentStatus}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* My Reviews */}
        {activeTab === "myReviews" && (
          <div>
            {myReviews.length === 0 ? (
              <p className="text-center text-gray-400">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {myReviews.map((r) => (
                  <li
                    key={r.id}
                    className="p-4 border border-zinc-700 rounded-lg bg-zinc-700"
                  >
                    <p>
                      <strong>Rating:</strong> ⭐ {r.rating}/5
                    </p>
                    <p>
                      <strong>Comment:</strong> {r.comment}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Court Bookings (Owner Section) */}
        {activeTab === "courtBookings" && (
          <div>
            {courtBookings.length === 0 ? (
              <p className="text-center text-gray-400">
                No one booked your courts yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {courtBookings.map((b) => {
                  const price = (b.pricePerHour * b.duration) / 60;
                  return (
                    <li
                      key={b.id}
                      className="p-4 border border-zinc-700 rounded-lg bg-zinc-700"
                    >
                      <p>
                        <strong>Court:</strong> {b.courtName} (
                        {b.sportType})
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(b.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Time:</strong> {b.startTime} - {b.endTime} (
                        {b.duration} mins)
                      </p>
                      <p>
                        <strong>Status:</strong> {b.status}
                      </p>
                      <p>
                        <strong>Payment:</strong> {b.paymentStatus}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹{price}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
