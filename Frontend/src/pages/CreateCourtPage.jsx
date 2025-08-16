import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { FaSpinner, FaMoneyBillWave, FaClock, FaImage, FaTrophy } from "react-icons/fa";
import { MdSportsTennis } from "react-icons/md";
import NavBar from "../components/NavBar";

function CreateCourtPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const facilityId = location.state?.facilityId;

  const [formData, setFormData] = useState({
    name: "",
    sportType: "",
    pricePerHour: "",
    operatingHours: "09:00-18:00",
    photoUrl: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    sportType: "",
    pricePerHour: "",
    operatingHours: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) error = "Court name is required";
        else if (value.length > 50) error = "Name must be less than 50 characters";
        break;
      case "sportType":
        if (!value.trim()) error = "Sport type is required";
        break;
      case "pricePerHour":
        if (!value) error = "Price is required";
        else if (parseFloat(value) <= 0) error = "Price must be greater than 0";
        break;
      case "operatingHours":
        if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(value)) error = "Format: HH:MM-HH:MM";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Clear API error if it exists
    if (apiError) {
      setApiError("");
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      if (key !== "photoUrl") {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    if (!facilityId) {
      setApiError("No facility selected. Please go back and select a facility.");
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
      setTimeout(() => navigate("/myfacilities"), 1500);
    } catch (err) {
      console.error("Failed to create court:", err);
      setApiError(err.response?.data?.message || "Failed to create court. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    {
      name: "name",
      placeholder: "Court Name",
      icon: <MdSportsTennis className="text-green-500" />,
      type: "text"
    },
    {
      name: "sportType",
      placeholder: "Sport Type (e.g., Tennis, Basketball)",
      icon: <FaTrophy className="text-green-500" />,
      type: "text"
    },
    {
      name: "pricePerHour",
      placeholder: "Price Per Hour (₹)",
      icon: <FaMoneyBillWave className="text-green-500" />,
      type: "number",
      min: "1",
      step: "50"
    },
    {
      name: "operatingHours",
      placeholder: "Operating Hours (HH:MM-HH:MM)",
      icon: <FaClock className="text-green-500" />,
      type: "text"
    },
    {
      name: "photoUrl",
      placeholder: "Photo URL (optional)",
      icon: <FaImage className="text-green-500" />,
      type: "url",
      required: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-center">
          <h2 className="text-2xl font-bold">Create New Court</h2>
          <p className="text-green-100 mt-1">Add a new court to your facility</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Status Messages */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              {apiError}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {inputFields.map((field) => (
              <div key={field.name} className="mb-4">
                <div className="flex items-center gap-2 mb-1 text-sm text-gray-300">
                  {field.icon}
                  <label htmlFor={field.name}>
                    {field.placeholder.split(' (')[0]}
                    {field.required !== false && <span className="text-red-500 ml-1">*</span>}
                  </label>
                </div>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    errors[field.name] ? "border-red-500" : "border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition`}
                  required={field.required !== false}
                  min={field.min}
                  step={field.step}
                />
                {errors[field.name] && (
                  <p className="text-red-400 text-xs mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Court"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCourtPage;