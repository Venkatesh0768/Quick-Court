import React, { useState } from "react";
import axiosInstance from "../utils/axios";

const CreateCourtModal = ({ facilityId, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [sportType, setSportType] = useState("TENNIS");
  const [pricePerHour, setPricePerHour] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        facilityId,
        name,
        sportType,
        pricePerHour: parseFloat(pricePerHour),
        operatingHours,
      };

      const response = await axiosInstance.post("/courts", payload);

      if (response.status === 201 || response.status === 200) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Error creating court:", err);
      setError("Failed to create court. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Create a Court</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Court Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <select
            value={sportType}
            onChange={(e) => setSportType(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="TENNIS">Tennis</option>
            <option value="FOOTBALL">Football</option>
            <option value="BASKETBALL">Basketball</option>
            <option value="CRICKET">Cricket</option>
          </select>

          <input
            type="number"
            placeholder="Price per Hour"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Operating Hours (e.g. 09:00-18:00)"
            value={operatingHours}
            onChange={(e) => setOperatingHours(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourtModal;
