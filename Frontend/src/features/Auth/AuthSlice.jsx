import { createSlice } from "@reduxjs/toolkit";

// Safely get user from localStorage with error handling
const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem("user");
    return null;
  }
};

const storedUser = getUserFromStorage();

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null, 
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    authSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      
      // Safely store user data
      try {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } catch (error) {
        console.error("Error storing user to localStorage:", error);
      }
    },

    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    },
    
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.token = null;
      
      // Clear all auth-related data from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Update user data (for profile updates)
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        try {
          localStorage.setItem("user", JSON.stringify(state.user));
        } catch (error) {
          console.error("Error updating user in localStorage:", error);
        }
      }
    },
    
    // Set token (if you're using JWT tokens)
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { 
  startLoading, 
  authSuccess, 
  authFailure, 
  logout, 
  clearError, 
  updateUser,
  setToken 
} = authSlice.actions;

export default authSlice.reducer;