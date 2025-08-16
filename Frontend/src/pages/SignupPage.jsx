import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  authSuccess,
  authFailure,
} from "../features/Auth/AuthSlice";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight } from "react-icons/fi";

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
  const [showPassword, setShowPassword] = useState(false);

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
      errors.password = "Password must contain uppercase, lowercase, and number";
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
      successMessage.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in';
      successMessage.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Account created successfully! Redirecting to login...
      `;
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

  const getInputIcon = (field) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return <FiUser className="text-gray-400" />;
      case 'email':
        return <FiMail className="text-gray-400" />;
      case 'password':
        return <FiLock className="text-gray-400" />;
      case 'phoneNumber':
        return <FiPhone className="text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join us to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['firstName', 'lastName'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-300 mb-1">
                    {field === 'firstName' ? 'First Name' : 'Last Name'}
                  </label>
                  <div className={`relative flex items-center rounded-lg border ${validationErrors[field] ? 'border-red-500' : 'border-gray-700'} bg-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all`}>
                    <span className="pl-3">
                      {getInputIcon(field)}
                    </span>
                    <input
                      type="text"
                      id={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={field === 'firstName' ? 'John' : 'Doe'}
                      className="w-full py-2.5 px-3 bg-transparent outline-none text-white placeholder-gray-400"
                    />
                  </div>
                  {validationErrors[field] && (
                    <p className="mt-1 text-xs text-red-400">{validationErrors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className={`relative flex items-center rounded-lg border ${validationErrors.email ? 'border-red-500' : 'border-gray-700'} bg-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all`}>
                <span className="pl-3">
                  {getInputIcon('email')}
                </span>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full py-2.5 px-3 bg-transparent outline-none text-white placeholder-gray-400"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <div className={`relative flex items-center rounded-lg border ${validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-700'} bg-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all`}>
                <span className="pl-3">
                  {getInputIcon('phoneNumber')}
                </span>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formatPhoneNumber(formData.phoneNumber)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      handleChange({ target: { id: 'phoneNumber', value } });
                    }
                  }}
                  placeholder="123-456-7890"
                  className="w-full py-2.5 px-3 bg-transparent outline-none text-white placeholder-gray-400"
                />
              </div>
              {validationErrors.phoneNumber && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className={`relative flex items-center rounded-lg border ${validationErrors.password ? 'border-red-500' : 'border-gray-700'} bg-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all`}>
                <span className="pl-3">
                  {getInputIcon('password')}
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full py-2.5 px-3 bg-transparent outline-none text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.password}</p>
              )}
              <div className="mt-2 text-xs text-gray-400">
                Password must contain:
                <ul className="list-disc list-inside ml-2">
                  <li className={formData.password.length >= 6 ? 'text-green-400' : ''}>At least 6 characters</li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}>One uppercase letter</li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-400' : ''}>One lowercase letter</li>
                  <li className={/\d/.test(formData.password) ? 'text-green-400' : ''}>One number</li>
                </ul>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                >
                  <option value="OWNER">Venue Owner</option>
                  <option value="USER">User</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors flex items-center justify-center ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Sign Up <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;