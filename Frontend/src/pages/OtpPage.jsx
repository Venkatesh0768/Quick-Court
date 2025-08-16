import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authSuccess } from "../features/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import { verifyOtp, sendOtp } from "../utils/UserApis";
import { FiMail, FiArrowLeft, FiClock, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";

function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, user } = location.state || {};

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await verifyOtp(email, otp);

      let finalUserData;

      if (response.data?.data?.id) {
        finalUserData = response.data.data;
      } else if (response.data?.user?.id) {
        finalUserData = response.data.user;
      } else if (response.data?.id) {
        finalUserData = response.data;
      } else if (user?.id) {
        finalUserData = user;
      } else {
        throw new Error("No valid user data available");
      }

      dispatch(authSuccess(finalUserData));
      
      // Show success notification
      const successMessage = document.createElement("div");
      successMessage.className = "fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in";
      successMessage.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Verification successful! Redirecting...
      `;
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
        navigate("/");
      }, 2000);
      
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    setError("");

    try {
      await sendOtp(email);
      setTimer(60);
      setCanResend(false);
      setOtp("");

      // Show resend success notification
      const successMessage = document.createElement("div");
      successMessage.className = "fixed top-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in";
      successMessage.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        New OTP sent successfully!
      `;
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="text-3xl text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
          <p className="text-gray-400">
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-blue-400">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-center">
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                maxLength="6"
                placeholder="• • • • • •"
                className="w-full max-w-xs p-4 border border-gray-700 rounded-xl text-center text-3xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-500"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </motion.div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={otp.length !== 6 || isSubmitting}
            className={`w-full py-3.5 rounded-xl text-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              otp.length === 6
                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg hover:shadow-blue-500/30"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </motion.button>

          <div className="text-center text-sm text-gray-400">
            <p className="mb-2">Didn't receive the code?</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleResend}
              disabled={!canResend || isResending}
              className={`inline-flex items-center gap-1 font-medium ${
                canResend && !isResending
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            >
              {isResending ? (
                <>
                  <FiRefreshCw className="animate-spin" />
                  Sending...
                </>
              ) : canResend ? (
                "Resend OTP"
              ) : (
                <>
                  <FiClock className="inline mr-1" />
                  Resend in {timer}s
                </>
              )}
            </motion.button>
          </div>

          <div className="text-center mt-6">
            <motion.button
              whileHover={{ x: -2 }}
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm"
            >
              <FiArrowLeft className="mr-1" /> Back to Login
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default OtpPage;