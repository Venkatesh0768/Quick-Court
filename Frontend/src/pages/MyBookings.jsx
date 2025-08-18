import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import NavBar from "../components/NavBar";
import {
  FaStar,
  FaCalendarAlt,
  FaClock,
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function MyBookings() {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("myBookings");
  const [myBookings, setMyBookings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [courtBookings, setCourtBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserDetails = async () => {
      try {
        const res = await axiosInstance.get(`/users/${user.id}`);

        // Enhance bookings with court price information
        const enhancedBookings = res.data.bookings?.map(booking => ({
          ...booking,
          pricePerHour: booking.court?.pricePerHour || 20, // Default to 20 if not available
          courtName: booking.court?.name || "Court"
        })) || [];

        setMyBookings(enhancedBookings);
        setMyReviews(res.data.reviews || []);

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
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

    if (loading) {
    return (
      <div className="w-full min-h-screen bg-zinc-900 text-white flex items-center justify-center flex-col">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 bg-green-600 rounded-full mx-auto mb-4"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  const StatusBadge = ({ status }) => {
    const statusMap = {
      CONFIRMED: {
        color: "bg-green-100 text-green-800",
        icon: <FaCheckCircle className="mr-1" />,
      },
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <FaClock className="mr-1" />,
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800",
        icon: <FaTimesCircle className="mr-1" />,
      },
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusMap[status]?.color || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusMap[status]?.icon || null}
        {status}
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white ">
      <NavBar />

      <div className="max-w-5xl mx-auto mt-10 p-4 sm:p-6 bg-zinc-800 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">My Account</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6 overflow-x-auto">
          <div className="flex rounded-lg bg-zinc-700 p-1">
            <button
              className={`px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base rounded-md transition-all ${
                activeTab === "myBookings"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-zinc-600"
              }`}
              onClick={() => setActiveTab("myBookings")}
            >
              My Bookings
            </button>
            <button
              className={`px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base rounded-md transition-all ${
                activeTab === "myReviews"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-zinc-600"
              }`}
              onClick={() => setActiveTab("myReviews")}
            >
              My Reviews
            </button>
            {user?.role === "OWNER" && (
              <button
                className={`px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base rounded-md transition-all ${
                  activeTab === "courtBookings"
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-zinc-600"
                }`}
                onClick={() => setActiveTab("courtBookings")}
              >
                Court Bookings
              </button>
            )}
          </div>
        </div>

        {/* My Bookings */}
        {activeTab === "myBookings" && (
          <div>
            {myBookings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-4">
                  You haven't made any bookings yet
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200">
                  Find Courts
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {myBookings.map((b) => {
                  const price = (b.pricePerHour * b.duration) / 60;
                  return (
                    <li
                      key={b.id}
                      className="p-4 border border-zinc-700 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">
                          {b.courtName}
                        </h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="flex items-center text-gray-300">
                            <FaCalendarAlt className="mr-2 text-green-500" />
                            {new Date(b.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="flex items-center text-gray-300">
                            <FaClock className="mr-2 text-green-500" />
                            {b.startTime} - {b.endTime} ({b.duration} mins)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="flex items-center text-gray-300">
                            <FaWallet className="mr-2 text-green-500" />
                            ₹{price.toFixed(2)} (₹{b.pricePerHour}/hr)
                          </p>
                          <p className="text-gray-300">
                            Payment:{" "}
                            <span
                              className={
                                b.paymentStatus === "PAID"
                                  ? "text-green-400"
                                  : "text-yellow-400"
                              }
                            >
                              {b.paymentStatus}
                            </span>
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* My Reviews */}
        {activeTab === "myReviews" && (
          <div>
            {myReviews.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-4">
                  You haven't written any reviews yet
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200">
                  Book a Court
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {myReviews.map((r) => (
                  <li
                    key={r.id}
                    className="p-4 border border-zinc-700 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{r.courtName || "Court"}</h3>
                      <div className="flex items-center bg-green-900 bg-opacity-30 px-2 py-1 rounded">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < r.rating ? "text-yellow-400" : "text-gray-500"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">{r.comment}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
              <div className="text-center py-10">
                <p className="text-gray-400 mb-4">
                  No bookings for your courts yet
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200">
                  Promote Your Courts
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {courtBookings.map((b) => {
                  const price = (b.pricePerHour * b.duration) / 60;
                  return (
                    <li
                      key={b.id}
                      className="p-4 border border-zinc-700 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{b.courtName}</h3>
                          <span className="text-sm bg-green-900 bg-opacity-30 px-2 py-1 rounded">
                            {b.sportType}
                          </span>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="space-y-2">
                          <p className="flex items-center text-gray-300">
                            <FaCalendarAlt className="mr-2 text-green-500" />
                            {new Date(b.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="flex items-center text-gray-300">
                            <FaClock className="mr-2 text-green-500" />
                            {b.startTime} - {b.endTime} ({b.duration} mins)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="flex items-center text-gray-300">
                            <FaWallet className="mr-2 text-green-500" />
                            ₹{price.toFixed(2)} (₹{b.pricePerHour}/hr)
                          </p>
                          <p className="text-gray-300">
                            Payment:{" "}
                            <span
                              className={
                                b.paymentStatus === "PAID"
                                  ? "text-green-400"
                                  : "text-yellow-400"
                              }
                            >
                              {b.paymentStatus}
                            </span>
                          </p>
                        </div>
                      </div>
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