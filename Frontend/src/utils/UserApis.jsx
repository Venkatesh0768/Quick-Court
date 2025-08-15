// src/api/api.js
import axiosInstance from "../utils/axios";

// -------------------- AUTH --------------------

export const signupUser = (data) => axiosInstance.post("/auth/signup", data);

export const loginUser = (data) => axiosInstance.post("/auth/login", data);

export const sendOtp = (email) =>
  axiosInstance.post("/auth/otp/send", { email });

export const verifyOtp = (email, otp) =>
  axiosInstance.post("/auth/otp/verify", { email, otp });

export const validateSession = () => axiosInstance.get("/auth/validate");

export const getAllUsersFromAuth = () => axiosInstance.get("/auth/users");




// -------------------- USERS --------------------

export const getAllUsers = () => axiosInstance.get("/users");

export const getUserById = (userId) => axiosInstance.get(`/users/${userId}`);

export const updateUser = (userId, data) =>
  axiosInstance.put(`/users/${userId}`, data);

// Delete user
export const deleteUser = (userId) => axiosInstance.delete(`/users/${userId}`);
