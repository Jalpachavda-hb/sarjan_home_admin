import axios from "axios";
import { BASE_URL } from "./apiPaths";
import { toast } from "react-toastify";
// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Attach role if user exists
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const storedUser = sessionStorage.getItem("user");

//     if (storedUser) {
//       try {
//         const userData = JSON.parse(storedUser); // only once
//         if (userData?.role) {
//           config.headers["x-role-id"] = userData.role;
//         }
//       } catch (e) {
//         console.error("Failed to parse user from sessionStorage", e);
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Global error handling
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       if (error.response.status === 401) {
//         sessionStorage.clear();
//         window.location.href = "/login";
//       } else if (error.response.status === 500) {
//         console.error("Internal server error. Please try again later.");
//       }
//     } else if (error.code === "ECONNABORTED") {
//       console.error("Request timeout. Please try again later.");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach role if user exists
axiosInstance.interceptors.request.use(
  (config) => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData?.role) {
          config.headers["x-role-id"] = userData.role;
        }
      } catch (e) {
        console.error("Failed to parse user from sessionStorage", e);
        toast.error("Failed to retrieve user data. Please login again.");
      }
    }

    return config;
  },
  (error) => {
    toast.error("Request setup error.");
    return Promise.reject(error);
  }
);

// Global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        toast.error("Session expired. Redirecting to login...");
        sessionStorage.clear();
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (status === 403) {
        toast.error("Access denied.");
      } else if (status === 404) {
        toast.error("Resource not found.");
      } else if (status === 500) {
        toast.error("Internal server error. Please try again later.");
      } else {
        toast.error(`Unexpected error: ${status}`);
      }
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please try again later.");
    } else {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
