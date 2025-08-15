import React, { useState } from "react";
import {
  authFailure,
  authSuccess,
  startLoading,
} from "../features/Auth/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, sendOtp } from "../utils/UserApis";

function LoginPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    if (validationErrors[id]) {
      setValidationErrors({ ...validationErrors, [id]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email format is invalid";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(startLoading());

    try {
      const response = await loginUser(formData);
      
      // 🔍 Debug the response structure
      console.log("=== LOGIN RESPONSE DEBUG ===");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Response data.data:", response.data.data);
      console.log("========================");
      
      // 🚨 FIX: Extract the correct user data
      let userData;
      
      // Try different possible data structures
      if (response.data.data) {
        userData = response.data.data;
      } else if (response.data.user) {
        userData = response.data.user;
      } else if (response.data && typeof response.data === 'object') {
        // If the user data is directly in response.data
        userData = response.data;
      } else {
        throw new Error("Invalid response structure");
      }
      
      console.log("🔧 User data being dispatched:", userData);
      console.log("🔧 User properties check:");
      console.log("- ID:", userData.id);
      console.log("- FirstName:", userData.firstName);
      console.log("- LastName:", userData.lastName);
      console.log("- Email:", userData.email);
      console.log("- Role:", userData.role);
      console.log("- Phone:", userData.phoneNumber);
      
      // 🚨 FIX: Only dispatch if we have valid user data with required fields
      if (!userData.id || !userData.email) {
        throw new Error("Invalid user data received from server");
      }
      
      // Dispatch the correct user data
      dispatch(authSuccess(userData));
      
      // Navigate to OTP page with complete user data
      navigate("/send/otp", { 
        state: { 
          email: formData.email, 
          user: userData 
        } 
      });
      
      console.log("🔧 Navigating to OTP with user data:", userData);
      
      // Send OTP
      await sendOtp(formData.email);
      
    } catch (err) {
      console.error("Login error:", err);
      dispatch(authFailure(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-zinc-900 text-white p-4">
      <div className="w-full max-w-md bg-zinc-700 flex justify-center items-center flex-col p-6 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">Login</h1>
        <p className="text-gray-300 mb-6">Please fill in your details</p>

        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          {["email", "password"].map((field) => (
            <div key={field} className="w-full mb-4">
              <label
                htmlFor={field}
                className="block mb-2 text-sm font-medium text-white"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <span className="text-red-500"> *</span>
              </label>
              <input
                type={field === "password" ? "password" : "email"}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                  validationErrors[field] ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {validationErrors[field] && (
                <p className="text-red-500 text-xs mt-1">{validationErrors[field]}</p>
              )}
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
            className={`w-full mt-4 p-2.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-blue-400 hover:underline"
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;