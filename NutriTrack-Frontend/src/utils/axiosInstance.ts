import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // if you're using cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to check for token expiration
axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  if (user?.tokenExpiry && Date.now() > user.tokenExpiry) {
    console.log("Token expired! Logging out...");

    // Clear localStorage and redirect to home
    localStorage.removeItem("loggedUser");
    window.location.href = "/"; // Redirect user to the homepage

    return Promise.reject("Token expired");
  }

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// Handle API errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized! Logging out...");
      localStorage.removeItem("loggedUser");
      window.location.href = "/"; // Redirect to home
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
