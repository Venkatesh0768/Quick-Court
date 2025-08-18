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

export const apiService = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials).then(res => {
    if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
    }
    return res.data;
  }),

  // Users
  getUsers: () => axiosInstance.get('/users').then(res => res.data),
  updateUser: (id, data) => axiosInstance.put(`/users/${id}`, data).then(res => res.data),
  createUser: (data) => axiosInstance.post('/users', data).then(res => res.data),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),

  // Courts
  getCourts: () => axiosInstance.get('/courts').then(res => res.data),
  createCourt: (data) => axiosInstance.post('/courts', data).then(res => res.data),
  updateCourt: (id, data) => axiosInstance.put(`/courts/${id}`, data).then(res => res.data),
  deleteCourt: (id) => axiosInstance.delete(`/courts/${id}`),

  // Facilities
  getFacilities: () => axiosInstance.get('/facilities').then(res => res.data),
  createFacility: (data) => axiosInstance.post('/facilities', data).then(res => res.data),
  updateFacility: (id, data) => axiosInstance.put(`/facilities/${id}`, data).then(res => res.data),
  deleteFacility: (id) => axiosInstance.delete(`/facilities/${id}`),

  // Bookings
  getBookings: () => axiosInstance.get('/bookings').then(res => res.data),
  createBooking: (data) => axiosInstance.post('/bookings', data).then(res => res.data),
  updateBooking: (id, data) => axiosInstance.put(`/bookings/${id}`, data).then(res => res.data),
  deleteBooking: (id) => axiosInstance.delete(`/bookings/${id}`),

  // Matches
  getMatches: () => axiosInstance.get('/matches').then(res => res.data),
  createMatch: (data) => axiosInstance.post('/matches', data).then(res => res.data),
  updateMatch: (id, data) => axiosInstance.put(`/matches/${id}`, data).then(res => res.data),
  deleteMatch: (id) => axiosInstance.delete(`/matches/${id}`),

  // Reviews
  getReviews: () => axiosInstance.get('/reviews').then(res => res.data),
  deleteReview: (id) => axiosInstance.delete(`/reviews/${id}`),
};
