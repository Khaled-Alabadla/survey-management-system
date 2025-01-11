/**
 * Created by Zura on 12/25/2021.
 */
import axios from "axios";
import store from "./store";
import router from "./router";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  // Adding timeout to prevent requests from hanging indefinitely
  timeout: 10000, // 10 seconds
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Ensure the token exists before adding it to the request header
    if (store.state.user.token) {
      config.headers.Authorization = `Bearer ${store.state.user.token}`;
    }
    return config;
  },
  (error) => {
    // Handle errors that occur while creating the request
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Check for specific HTTP status codes and take appropriate actions
      switch (error.response.status) {
        case 401:
          sessionStorage.removeItem("TOKEN");
          router.push({ name: "Login" });
          break;
        case 404:
          router.push({ name: "NotFound" });
          break;
        case 500:
          console.error("Server error:", error.response.data.message || "Internal Server Error");
          break;
        default:
          console.error(`Error: ${error.response.status}`, error.response.data);
      }
    } else if (error.request) {
      // Handle network errors or no response from the server
      console.error("Network error:", error.message);
    } else {
      // Handle other errors
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
