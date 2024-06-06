import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "./config";
import * as AuthSession from "expo-auth-session";
import axios from "axios";

const redirectUri = AuthSession.makeRedirectUri({
  native: `your-scheme://redirect`,
});

export const storeTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  try {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    console.log("Tokens stored successfully");
  } catch (error) {
    console.error("Failed to save tokens:", error);
  }
};

export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    console.log("Access token retrieved:", token);
    return token;
  } catch (error) {
    console.error("Failed to retrieve access token:", error);
    return null;
  }
};

export const getRefreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem("refreshToken");
    console.log("Refresh token retrieved:", token);
    return token;
  } catch (error) {
    console.error("Failed to retrieve refresh token:", error);
    return null;
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${config.serverUrl}/auth/refresh`, {
      refreshToken,
    });

    if (response.status !== 200) {
      throw new Error("Failed to refresh access token");
    }

    const data = response.data;
    await storeTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    throw error;
  }
};

export const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    console.log("Tokens cleared");
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
};

const axiosInstance = axios.create({
  baseURL: config.serverUrl,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = await getAccessToken();
    if (!accessToken) {
      accessToken = await refreshAccessToken();
    }
    if (config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await refreshAccessToken();
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const fetchWithAuth = async (url: string, options: any = {}) => {
  try {
    const response = await axiosInstance({
      url,
      method: options.method || "GET",
      data: options.body,
      headers: options.headers,
    });
    return response;
  } catch (error) {
    console.error("Error in fetchWithAuth:", error);
    throw error;
  }
};

export const updateUserProfile = async (profile: FormData) => {
  const response = await fetchWithAuth(`${config.serverUrl}/auth/user`, {
    method: "PUT",
    body: profile,
  });
  if (response.status !== 200) {
    throw new Error("Failed to update profile");
  }
  return response.data;
};

export const getUserPosts = async () => {
  const response = await fetchWithAuth(`${config.serverUrl}/post/user`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch user posts");
  }
  return response.data;
};

export const getUserProfile = async () => {
  const response = await fetchWithAuth(`${config.serverUrl}/auth/user`);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }
  return response.data;
};

export const createPost = async (post: FormData): Promise<any> => {
  const response = await fetchWithAuth(`${config.serverUrl}/post`, {
    method: "POST",
    body: post,
  });
  if (response.status !== 201) {
    throw new Error("Failed to create post");
  }
  return response.data;
};

export const updatePost = async (
  postId: string,
  post: FormData
): Promise<any> => {
  const response = await fetchWithAuth(`${config.serverUrl}/post/${postId}`, {
    method: "PUT",
    body: post,
  });
  if (response.status !== 200) {
    throw new Error("Failed to update post");
  }
  return response.data;
};

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: config.googleClientIdWeb,
    iosClientId: config.googleClientIdIos,
    androidClientId: config.googleClientIdAndroid,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetch(`${config.serverUrl}/auth/google/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authentication?.accessToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          storeTokens(data.accessToken, data.refreshToken);
          console.log("Google login successful");
        })
        .catch((error) => console.error("Error logging in with Google", error));
    }
  }, [response]);

  return { promptAsync };
};
