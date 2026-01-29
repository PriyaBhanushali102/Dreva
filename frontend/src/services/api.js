import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // 401 = Unauthorized
      if (status === 401) {
        // Clear user data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isVendor");
        window.location.href = "/login";

        // Redirect to login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      // 403 = Forbidden
      if (status === 403) {
        console.error(
          "Access forbidden: you don't have permission to access this resource."
        );
      }

      // 404 = Not found
      if (status === 404) {
        console.error("Resource not found.");
      }

      // 500 = Server error
      // if (status >= 500) {
      //   console.error("Server error occurred.");
      // }
    }

    return Promise.reject(error);
  }
);

export default api;
