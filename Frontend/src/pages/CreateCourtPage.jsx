import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/axios";

function CreateCourtPage() {
  const location = useLocation();
  const facilityId = location.state?.facilityId;

  const [formData, setFormData] = useState({
    name: "",
    sportType: "",
    pricePerHour: "",
    operatingHours: "09:00-18:00",
    photoUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Court name is required.");
      return;
    }
    if (!formData.pricePerHour || parseFloat(formData.pricePerHour) <= 0) {
      setError("Price per hour must be greater than 0.");
      return;
    }
    if (!facilityId) {
      setError("No facility selected. Please go back and select a facility.");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post("/courts", {
        ...formData,
        facilityId,
        pricePerHour: parseFloat(formData.pricePerHour),
      });

      setSuccess("Court created successfully!");
      setFormData({ ...formData, name: "", pricePerHour: "", photoUrl: "" });
    } catch (err) {
      console.error("Failed to create court:", err);
      setError(err.response?.data?.message || "Failed to create court.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl text-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6">Create a Court</h2>

        {error && (
          <div className="mb-4 p-3 text-center bg-red-500/20 text-red-400 border border-red-500 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 text-center bg-green-500/20 text-green-400 border border-green-500 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Court Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 mb-5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input  
            type="text"
            name="sportType"
            placeholder="sportType"
            value={formData.sportType}
            onChange={handleChange}
            className="w-full p-3 mb-5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="number"
            name="pricePerHour"
            placeholder="Price Per Hour"
            value={formData.pricePerHour}
            onChange={handleChange}
            className="w-full p-3 mb-5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="text"
            name="operatingHours"
            placeholder="Operating Hours (e.g., 08:00-20:00)"
            value={formData.operatingHours}
            onChange={handleChange}
            className="w-full p-3 mb-5 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="url"
            name="photoUrl"
            placeholder="Photo URL (optional)"
            value={formData.photoUrl}
            onChange={handleChange}
            className="w-full p-3 mb-6 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCourtPage;
