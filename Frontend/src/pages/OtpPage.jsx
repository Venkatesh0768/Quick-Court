import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authSuccess } from "../features/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import { verifyOtp, sendOtp } from "../utils/UserApis";

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

    try {
      console.log("Verifying OTP:", otp);
      const response = await verifyOtp(email, otp);

      let finalUserData;

      if (
        response.data.data &&
        typeof response.data.data === "object" &&
        response.data.data.id
      ) {
        finalUserData = response.data.data;
      } else if (
        response.data.user &&
        typeof response.data.user === "object" &&
        response.data.user.id
      ) {
        finalUserData = response.data.user;
      } else if (response.data && response.data.id) {
        finalUserData = response.data;
      } else if (user && user.id) {
        finalUserData = user;
      } else {
        throw new Error(
          "No valid user data available - user data from login is missing"
        );
      }

      dispatch(authSuccess(finalUserData));
    

      navigate("/");
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    setError("");

    try {
      console.log("Resending OTP to:", email);
      await sendOtp(email);
      setTimer(60);
      setCanResend(false);
      setOtp("");

      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg z-50";
      successMessage.textContent = "OTP sent successfully!";
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="bg-zinc-800 p-8 rounded-2xl shadow-lg w-full max-w-md border border-zinc-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-mail-line text-2xl text-blue-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
          <p className="text-gray-400">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-white">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              maxLength="6"
              placeholder="000000"
              className="w-full p-4 border border-zinc-600 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 bg-zinc-700 text-white placeholder-gray-500"
              autoComplete="one-time-code"
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Enter the 6-digit code
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={otp.length !== 6}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition-colors ${
              otp.length === 6
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-zinc-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isResending}
            className={`font-medium transition-colors ${
              canResend && !isResending
                ? "text-blue-400 hover:underline"
                : "text-gray-600 cursor-not-allowed"
            }`}
          >
            {isResending
              ? "Sending..."
              : canResend
              ? "Resend OTP"
              : `Resend in ${timer}s`}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-gray-400 text-sm hover:text-white transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtpPage;
