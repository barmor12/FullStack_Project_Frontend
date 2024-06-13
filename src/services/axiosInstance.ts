import axios from "axios";
import { getAccessToken, refreshAccessToken, clearTokens } from "./authService";
import config from "../Config/config";

// יצירת אינסטנס של Axios
const axiosInstance = axios.create({
  baseURL: config.serverUrl,
});

// אינטרספטור לבדיקת תוקף הטוקן והוספתו לכל בקשה
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = await getAccessToken();
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
        const newAccessToken = await refreshAccessToken();
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearTokens();
        // handle error gracefully
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
