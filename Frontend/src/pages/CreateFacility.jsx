// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { startLoading, clearError } from "../features/Auth/AuthSlice";
// import axiosInstance from "../utils/axios";
// import { FaMapMarkerAlt, FaInfoCircle, FaBuilding, FaCity, FaGlobeAmericas } from "react-icons/fa";
// import { MdDescription, MdPinDrop } from "react-icons/md";

// function CreateFacility() {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     address: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     latitude: "",
//     longitude: "",
//   });

//   const [fieldErrors, setFieldErrors] = useState({
//     name: "",
//     description: "",
//     address: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     latitude: "",
//     longitude: "",
//   });

//   const validateField = (name, value) => {
//     let error = "";
    
//     switch (name) {
//       case "name":
//         if (!value.trim()) error = "Facility name is required";
//         else if (value.length > 50) error = "Name must be less than 50 characters";
//         break;
//       case "description":
//         if (!value.trim()) error = "Description is required";
//         else if (value.length > 500) error = "Description must be less than 500 characters";
//         break;
//       case "address":
//         if (!value.trim()) error = "Address is required";
//         break;
//       case "city":
//         if (!value.trim()) error = "City is required";
//         break;
//       case "state":
//         if (!value.trim()) error = "State is required";
//         break;
//       case "zipCode":
//         if (!/^\d{5,6}$/.test(value)) error = "Invalid zip code (5-6 digits)";
//         break;
//       case "latitude":
//         if (value && isNaN(Number(value))) error = "Must be a valid number";
//         else if (value && (Number(value) < -90 || Number(value) > 90)) error = "Must be between -90 and 90";
//         break;
//       case "longitude":
//         if (value && isNaN(Number(value))) error = "Must be a valid number";
//         else if (value && (Number(value) < -180 || Number(value) > 180)) error = "Must be between -180 and 180";
//         break;
//       default:
//         break;
//     }
    
//     return error;
//   };

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({ ...prev, [id]: value }));
    
//     if (fieldErrors[id]) {
//       setFieldErrors(prev => ({ ...prev, [id]: "" }));
//     }
    
//     if (error) {
//       dispatch(clearError());
//     }
//   };

//   const handleBlur = (e) => {
//     const { id, value } = e.target;
//     const error = validateField(id, value);
//     setFieldErrors(prev => ({ ...prev, [id]: error }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     let isValid = true;

//     Object.keys(formData).forEach(key => {
//       if (key !== "latitude" && key !== "longitude") {
//         const error = validateField(key, formData[key]);
//         if (error) {
//           newErrors[key] = error;
//           isValid = false;
//         }
//       }
//     });

//     setFieldErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch(clearError());
    
//     if (!validateForm()) {
//       return;
//     }

//     dispatch(startLoading());

//     const payload = {
//       ...formData,
//       ownerId: user?.id ?? null,
//       latitude: formData.latitude === "" ? null : Number(formData.latitude),
//       longitude: formData.longitude === "" ? null : Number(formData.longitude),
//     };

//     try {
//       await axiosInstance.post("/facilities", payload);
//       navigate("/myfacilities");
//     } catch (err) {
//       console.error("Error creating facility:", err);
//       dispatch({
//         type: "auth/authFailure",
//         payload: err.response?.data?.message || "Failed to create facility. Please try again."
//       });
//     }
//   };

//   const inputFields = [
//     { field: "name", label: "Facility Name", type: "text", icon: <FaBuilding className="text-green-500" />, maxLength: 50 },
//     { field: "description", label: "Description", type: "textarea", icon: <MdDescription className="text-green-500" />, maxLength: 500 },
//     { field: "address", label: "Address", type: "text", icon: <FaMapMarkerAlt className="text-green-500" /> },
//     { field: "city", label: "City", type: "text", icon: <FaCity className="text-green-500" /> },
//     { field: "state", label: "State", type: "text", icon: <FaGlobeAmericas className="text-green-500" /> },
//     { field: "zipCode", label: "Zip Code", type: "text", icon: <MdPinDrop className="text-green-500" />, pattern: "[0-9]{5,6}" },
//     { field: "latitude", label: "Latitude", type: "number", icon: <FaInfoCircle className="text-green-500" />, step: "0.000001", min: -90, max: 90 },
//     { field: "longitude", label: "Longitude", type: "number", icon: <FaInfoCircle className="text-green-500" />, step: "0.000001", min: -180, max: 180 },
//   ];

//   return (
//     <div className="w-full min-h-screen bg-zinc-900 text-white p-4 md:p-8">
//       <div className="max-w-3xl mx-auto bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-center">
//           <h1 className="text-2xl md:text-3xl font-bold">Create New Facility</h1>
//           <p className="text-green-100 mt-2">Register your sports facility with QuickCourt</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 md:p-8" noValidate>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {inputFields.map(({ field, label, type, icon, ...inputProps }) => (
//               <div key={field} className="space-y-2">
//                 <label htmlFor={field} className="flex items-center gap-2 text-sm font-medium">
//                   {icon}
//                   {label}
//                   {field !== "latitude" && field !== "longitude" && (
//                     <span className="text-red-500">*</span>
//                   )}
//                 </label>
//                 {type === "textarea" ? (
//                   <div className="relative">
//                     <textarea
//                       id={field}
//                       name={field}
//                       value={formData[field]}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       rows={3}
//                       placeholder={`Enter ${label.toLowerCase()}`}
//                       className={`w-full px-4 py-2 bg-zinc-700 border ${fieldErrors[field] ? "border-red-500" : "border-zinc-600"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition`}
//                       required={field !== "latitude" && field !== "longitude"}
//                       maxLength={inputProps.maxLength}
//                     />
//                     {inputProps.maxLength && (
//                       <div className="text-xs text-gray-400 text-right mt-1">
//                         {formData[field].length}/{inputProps.maxLength}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <input
//                     type={type}
//                     id={field}
//                     name={field}
//                     value={formData[field]}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     placeholder={`Enter ${label.toLowerCase()}`}
//                     className={`w-full px-4 py-2 bg-zinc-700 border ${fieldErrors[field] ? "border-red-500" : "border-zinc-600"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition`}
//                     required={field !== "latitude" && field !== "longitude"}
//                     {...inputProps}
//                   />
//                 )}
//                 {fieldErrors[field] && (
//                   <p className="text-red-400 text-xs mt-1">{fieldErrors[field]}</p>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Location Help Text */}
//           <div className="mt-4 p-3 bg-zinc-700 rounded-lg text-sm text-gray-300">
//             <p>
//               <span className="font-semibold text-green-400">Note:</span> Latitude and longitude are optional. 
//               You can add them later from the facility dashboard for more accurate location services.
//             </p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
//               {error}
//             </div>
//           )}

//           {/* Submit Button */}
//           <div className="mt-8 flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="px-6 py-3 bg-zinc-600 hover:bg-zinc-500 rounded-lg font-medium transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2 ${
//                 loading ? "opacity-80 cursor-not-allowed" : ""
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating...
//                 </>
//               ) : (
//                 "Create Facility"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreateFacility;



import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { startLoading, clearError } from "../features/Auth/AuthSlice";
import axiosInstance from "../utils/axios";
import { FaMapMarkerAlt, FaInfoCircle, FaBuilding, FaCity, FaGlobeAmericas, FaLocationArrow } from "react-icons/fa";
import { MdDescription, MdPinDrop } from "react-icons/md";

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

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: "",
    longitude: "",
  });

  const [locationError, setLocationError] = useState("");

  // Get current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          setLocationError("Could not get your location. Please enter manually.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) error = "Facility name is required";
        else if (value.length > 50) error = "Name must be less than 50 characters";
        break;
      case "description":
        if (!value.trim()) error = "Description is required";
        else if (value.length > 500) error = "Description must be less than 500 characters";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        break;
      case "city":
        if (!value.trim()) error = "City is required";
        break;
      case "state":
        if (!value.trim()) error = "State is required";
        break;
      case "zipCode":
        if (!/^\d{5,6}$/.test(value)) error = "Invalid zip code (5-6 digits)";
        break;
      case "latitude":
        if (!value.trim()) error = "Latitude is required";
        else if (isNaN(Number(value))) error = "Must be a valid number";
        else if (Number(value) < -90 || Number(value) > 90) error = "Must be between -90 and 90";
        break;
      case "longitude":
        if (!value.trim()) error = "Longitude is required";
        else if (isNaN(Number(value))) error = "Must be a valid number";
        else if (Number(value) < -180 || Number(value) > 180) error = "Must be between -180 and 180";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    if (fieldErrors[id]) {
      setFieldErrors(prev => ({ ...prev, [id]: "" }));
    }
    
    if (error) {
      dispatch(clearError());
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const error = validateField(id, value);
    setFieldErrors(prev => ({ ...prev, [id]: error }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setLocationError("");
        },
        (error) => {
          setLocationError("Could not get your location. Please enter manually.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    if (!validateForm()) {
      return;
    }

    dispatch(startLoading());

    const payload = {
      ...formData,
      ownerId: user?.id ?? null,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

    try {
      await axiosInstance.post("/facilities", payload);
      navigate("/myfacilities");
    } catch (err) {
      console.error("Error creating facility:", err);
      dispatch({
        type: "auth/authFailure",
        payload: err.response?.data?.message || "Failed to create facility. Please try again."
      });
    }
  };

  const inputFields = [
    { field: "name", label: "Facility Name", type: "text", icon: <FaBuilding className="text-green-500" />, maxLength: 50 },
    { field: "description", label: "Description", type: "textarea", icon: <MdDescription className="text-green-500" />, maxLength: 500 },
    { field: "address", label: "Address", type: "text", icon: <FaMapMarkerAlt className="text-green-500" /> },
    { field: "city", label: "City", type: "text", icon: <FaCity className="text-green-500" /> },
    { field: "state", label: "State", type: "text", icon: <FaGlobeAmericas className="text-green-500" /> },
    { field: "zipCode", label: "Zip Code", type: "text", icon: <MdPinDrop className="text-green-500" />, pattern: "[0-9]{5,6}" },
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Create New Facility</h1>
          <p className="text-green-100 mt-2">Register your sports facility with QuickCourt</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputFields.map(({ field, label, type, icon, ...inputProps }) => (
              <div key={field} className="space-y-2">
                <label htmlFor={field} className="flex items-center gap-2 text-sm font-medium">
                  {icon}
                  {label}
                  <span className="text-red-500">*</span>
                </label>
                {type === "textarea" ? (
                  <div className="relative">
                    <textarea
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={3}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className={`w-full px-4 py-2 bg-zinc-700 border ${fieldErrors[field] ? "border-red-500" : "border-zinc-600"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition`}
                      required
                      maxLength={inputProps.maxLength}
                    />
                    {inputProps.maxLength && (
                      <div className="text-xs text-gray-400 text-right mt-1">
                        {formData[field].length}/{inputProps.maxLength}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type={type}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className={`w-full px-4 py-2 bg-zinc-700 border ${fieldErrors[field] ? "border-red-500" : "border-zinc-600"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition`}
                    required
                    {...inputProps}
                  />
                )}
                {fieldErrors[field] && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors[field]}</p>
                )}
              </div>
            ))}

            {/* Location Fields */}
            <div className="space-y-2">
              <label htmlFor="latitude" className="flex items-center gap-2 text-sm font-medium">
                <FaInfoCircle className="text-green-500" />
                Latitude
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter latitude"
                  step="0.000001"
                  min="-90"
                  max="90"
                  className={`w-full px-4 py-2 bg-zinc-700 border ${fieldErrors.latitude ? "border-red-500" : "border-zinc-600"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition`}
                  required
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center"
                  title="Get current location"
                >
                  <FaLocationArrow />
                </button>
              </div>
              {fieldErrors.latitude && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.latitude}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="longitude" className="flex items-center gap-2 text-sm font-medium">
                <FaInfoCircle className="text-green-500" />
                Longitude
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter longitude"
                step="0.000001"
                min="-180"
                max="180"
                className={`w-full px-4 py-2 bg-zinc-700 border ${fieldErrors.longitude ? "border-red-500" : "border-zinc-600"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition`}
                required
              />
              {fieldErrors.longitude && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.longitude}</p>
              )}
            </div>
          </div>

          {/* Location Help Text */}
          <div className="mt-4 p-3 bg-zinc-700 rounded-lg text-sm text-gray-300">
            <p>
              <span className="font-semibold text-green-400">Note:</span> Click the location icon to automatically 
              get your current coordinates. Make sure your browser has permission to access your location.
            </p>
            {locationError && (
              <p className="text-red-400 text-xs mt-1">{locationError}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-zinc-600 hover:bg-zinc-500 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Facility"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFacility;