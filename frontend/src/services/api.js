import axios from "axios";

// In development: VITE_API_BASE_URL is not set → falls back to "/api" (Vite proxy handles it)
// In production:  VITE_API_BASE_URL is set to the real backend URL (e.g. https://api.iitbhu-deals.com/api)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
});

// Automatically attach Authorization Bearer token from localStorage to every request.
// This guarantees authentication works across domains even if the browser blocks third-party cookies!
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so components can just read err.message.
// Also preserve extra fields like requiresVerification so auth flows work.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data || {};
    const message =
      data.message ||
      data.errors?.[0]?.message ||
      "Something went wrong. Please try again.";
    const err = new Error(message);
    // Preserve any extra fields sent by the backend (e.g. requiresVerification, email)
    if (data.requiresVerification) err.requiresVerification = true;
    if (data.email) err.email = data.email;
    return Promise.reject(err);
  }
);

export default api;
