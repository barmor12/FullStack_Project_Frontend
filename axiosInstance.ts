import axios from "axios";
import {
  getAccessToken,
  refreshAccessToken,
  isTokenExpired,
} from "./authService";
import config from "./config";

// יצירת אינסטנס של Axios
const axiosInstance = axios.create({
  baseURL: config.serverUrl,
});

// אינטרספטור לבדיקת תוקף הטוקן והוספתו לכל בקשה
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = await getAccessToken();

    if (token && isTokenExpired(token)) {
      try {
        token = await refreshAccessToken();
      } catch (error) {
        console.error("Failed to refresh access token:", error);
        throw error;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// אינטרספטור לניהול תגובות 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = await refreshAccessToken();
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
