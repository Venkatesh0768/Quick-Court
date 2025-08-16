import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";

function BookingPage() {
  const { courtId } = useParams(); // courtId comes from URL
  const navigate = useNavigate();

  const [court, setCourt] = useState(null);
  const [facility, setFacility] = useState(null);

  // Booking form state
  const [sport, setSport] = useState("Badminton");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(60); // minutes
  const userId = useSelector((state)=> state.auth.user.id) // mock logged-in user

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
        }
      } catch (error) {
        console.error("Error fetching court:", error);
      }
    };

    fetchCourt();
  }, [courtId]);

  const handleBooking = async () => {
    if (!date || !startTime || !duration) {
      alert("Please fill all fields before booking!");
      return;
    }

    // Calculate end time
    const [hours, minutes] = startTime.split(":").map(Number);
    const end = new Date();
    end.setHours(hours, minutes + duration);

    const endTime = end.toTimeString().split(" ")[0]; // HH:MM:SS

    const bookingData = {
      userId,
      courtId,
      date,
      startTime: `${startTime}:00`,
      endTime,
      duration,
      status: "CONFIRMED",
      paymentStatus: "PAID",
    };

    try {
      await axiosInstance.post("/bookings", bookingData);
      alert("Booking confirmed ✅");
      navigate(`/courtDetails/${courtId}`);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Try again!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white">
      <NavBar />

      <div className="max-w-2xl mx-auto mt-10 bg-zinc-800 p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-6">Court Booking</h1>

        {/* Venue Info */}
        {facility && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{facility.name}</h2>
            <p className="text-gray-400">
              📍 {facility.address} ⭐ 4.5 (6 reviews)
            </p>
          </div>
        )}

        {/* Sport */}
        <label className="block mb-2">Sport</label>
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-zinc-700"
        >
          <option>Badminton</option>
          <option>Tennis</option>
          <option>Cricket</option>
        </select>

        {/* Date */}
        <label className="block mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-zinc-700"
        />

        {/* Start Time */}
        <label className="block mb-2">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-zinc-700"
        />

        {/* Duration */}
        <label className="block mb-2">Duration (minutes)</label>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setDuration((d) => Math.max(30, d - 30))}
            className="bg-red-500 px-4 py-2 rounded"
          >
            -
          </button>
          <span className="text-lg">{duration} min</span>
          <button
            onClick={() => setDuration((d) => d + 30)}
            className="bg-green-500 px-4 py-2 rounded"
          >
            +
          </button>
        </div>

        {/* Court Selection */}
        <label className="block mb-2">Court</label>
        <select
          value={court?.name || ""}
          disabled
          className="w-full p-3 mb-6 rounded bg-zinc-700"
        >
          <option>{court?.name || "Court"}</option>
        </select>

        {/* Payment Button */}
        <button
          onClick={handleBooking}
          className="w-full bg-green-600 p-4 rounded-lg font-bold hover:bg-green-700 transition"
        >
          Continue to Payment – ₹{(court?.pricePerHour / 60) * duration}
        </button>
      </div>
    </div>
  );
}

export default BookingPage;
