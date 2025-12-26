import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isVendor: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isVendor = action.payload.isVendor;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    register: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isVendor = action.payload.isVendor || false;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isVendor = action.payload.isVendor || false;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isVendor = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateProfile: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const {
  hydrateAuth,
  setLoading,
  setError,
  clearError,
  register,
  login,
  logout,
  updateProfile,
} = authSlice.actions;
export default authSlice.reducer;
