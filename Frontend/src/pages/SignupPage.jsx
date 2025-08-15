import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  authSuccess,
  authFailure,
} from "../features/Auth/AuthSlice";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "OWNER",
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
  
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }
    
    
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }
    
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email format is invalid";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    

    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = "Phone number must be 10 digits";
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
      const cleanedData = {
        ...formData,
        phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };
      
      const response = await axiosInstance.post("/auth/signup", cleanedData);
      dispatch(authSuccess(response.data));
      
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg z-50';
      successMessage.textContent = 'Account created successfully! Redirecting to login...';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      console.error("Signup error:", err);
      dispatch(authFailure(err.response?.data?.message || err.message));
    }
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-zinc-900 text-white p-4">
      <div className="w-full max-w-md bg-zinc-700 flex justify-center items-center flex-col p-6 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">Sign Up</h1>
        <p className="text-gray-300 mb-6">Create your account</p>

        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          {[
            { field: "firstName", label: "First Name", type: "text" },
            { field: "lastName", label: "Last Name", type: "text" },
            { field: "email", label: "Email", type: "email" },
            { field: "password", label: "Password", type: "password" },
            { field: "phoneNumber", label: "Phone Number", type: "tel" },
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
                value={field === "phoneNumber" ? formatPhoneNumber(formData[field]) : formData[field]}
                onChange={(e) => {
                  if (field === "phoneNumber") {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      handleChange({ target: { id: field, value } });
                    }
                  } else {
                    handleChange(e);
                  }
                }}
                placeholder={`Enter your ${label.toLowerCase()}`}
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

          <div className="w-full mb-4">
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-white"
            >
              Role
              <span className="text-red-500"> *</span>
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="OWNER">Venue Owner</option>
              <option value="USER">User</option>
            </select>
          </div>

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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;