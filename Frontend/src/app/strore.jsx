import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/AuthSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
