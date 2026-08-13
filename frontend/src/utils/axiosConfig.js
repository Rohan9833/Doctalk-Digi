// src/utils/axiosConfig.js
import axios from "axios";

// Use your actual backend URL (not relative path)
// For development on local network
axios.defaults.baseURL = "http://192.168.1.15:2468";

// OR if testing on same computer
// axios.defaults.baseURL = 'http://localhost:2468/api';

// Add token to requests
axios.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const token = localStorage.getItem("mrToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      localStorage.removeItem("mrToken");
      localStorage.removeItem("mrData");
      window.location.href = "/mr/login";
    }
    return Promise.reject(error);
  },
);

export default axios;
