import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  login,
  logout as logoutAction,
  setLoading,
  setError,
  clearError,
} from "../store/slices/authSlice";
import * as authService from "../services/authService";
import toast from "react-hot-toast";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isVendor, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const loginUser = async (credentials) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authService.loginUser(credentials);

      dispatch(
        login({
          user: response.data.data,
          token: response.data.token,
          isVendor: false,
        })
      );

      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch(setError(message));
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const registerUser = async (userData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authService.registerUser(userData);

      dispatch(
        login({
          user: response.data.data,
          token: response.data.token,
          isVendor: false,
        })
      );

      toast.success("Registration successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      dispatch(setError(message));
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loginVendor = async (credentials) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authService.loginVendor(credentials);

      dispatch(
        login({
          user: response.data.data,
          token: response.data.token,
          isVendor: true,
        })
      );

      toast.success("Vendor login successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch(setError(message));
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const registerVendor = async (vendorData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const response = await authService.registerVendor(vendorData);

      dispatch(
        login({
          user: response.data.data,
          token: response.data.token,
          isVendor: true,
        })
      );

      toast.success("Vendor registration successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      dispatch(setError(message));
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  };
  const logout = async () => {
    try {
      if (isVendor) {
        await authService.logoutVendor();
      } else {
        await authService.logoutUser();
      }
    } catch (error) {
      console.log(error);
      // ignore api failure
    } finally {
      dispatch(logoutAction());
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Get user role
  const getUserRole = () => {
    if (!isAuthenticated) return "guest";
    return isVendor ? "vendor" : "user";
  };

  return {
    // State
    user,
    token,
    isVendor,
    isLoading,
    error,
    isAuthenticated,

    // Actions
    loginUser,
    registerUser,
    loginVendor,
    registerVendor,
    logout,

    // Utilities
    getUserRole,
  };
};
