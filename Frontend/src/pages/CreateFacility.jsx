import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { startLoading } from "../features/Auth/AuthSlice";
import axiosInstance from "../utils/axios";

function CreateFacility() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startLoading());

    const payload = {
      ...formData,
      ownerId: user?.id ?? null,
      latitude: formData.latitude === "" ? null : Number(formData.latitude),
      longitude: formData.longitude === "" ? null : Number(formData.longitude),
    };

    try {
      const response = await axiosInstance.post("/facilities", payload);
      console.log("Facility created:", response.data);
      navigate("/myfacilities");
    } catch (error) {
      console.error("Error creating facility:", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-zinc-900 text-white p-4">
      <div className="w-full max-w-md bg-zinc-700 flex justify-center items-center flex-col p-6 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">
          Create A Facility
        </h1>
        <p className="text-gray-300 mb-6">Create your Facility</p>

        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          {[
            { field: "name", label: "Name", type: "text" },
            { field: "description", label: "Description", type: "text" },
            {
              field: "address",
              label: "Address",
              type: "text",
            },
            { field: "city", label: "City", type: "text" },
            { field: "state", label: "State", type: "text" },
            { field: "zipCode", label: "Zip Code", type: "text" },
            { field: "latitude", label: "Latitude", type: "number" },
            { field: "longitude", label: "Longitude", type: "number" },
          ].map(({ field, label, type }) => (
            <div key={field} className="w-full mb-4">
              <label
                htmlFor={field}
                className="block mb-2 text-sm font-medium text-white"
              >
                {label}
                <span className="text-red-500"> *</span>
              </label>
              <input
                type={type}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${label.toLowerCase()}`}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
            </div>
          ))}

          {error && (
            <div className="w-full mb-4">
              <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/20 p-2 rounded">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            className={`w-full mt-4 p-2.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium "opacity-50 cursor-not-allowed" 
            }`}
          >
            {loading ? "Creating Facility..." : "Create Facility"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateFacility;
