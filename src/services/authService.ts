import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../Config/config";
import axios from "axios";
import { Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationProp, RootStackParamList } from "src/Types/types";
import { StackNavigationProp } from "@react-navigation/stack";

type GoogleAuthNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PasswordVerification"
>;

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

export const isTokenExpired = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
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

const axiosInstance = axios.create({
  baseURL: config.serverUrl,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = await getAccessToken();
    if (accessToken && isTokenExpired(accessToken)) {
      accessToken = await refreshAccessToken();
    }
    if (accessToken && config.headers) {
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

export const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    console.log("Tokens cleared");
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
};

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
  const navigation = useNavigation<GoogleAuthNavigationProp>();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Platform.select({
      ios: config.googleClientIdIos,
      android: config.googleClientIdAndroid,
      web: config.googleClientIdWeb,
    }),
    redirectUri: Platform.select({
      ios: "com.barmor.sceproject:/oauth2redirect",
      android: "exp://172.20.10.5:8081",
      web: "YOUR_WEB_REDIRECT_URI",
    }),
  });

  useEffect(() => {
    const handleGoogleLogin = async (idToken: string) => {
      try {
        const userResponse = await axios.post(
          `${config.serverUrl}/auth/google/check-user`,
          { token: idToken }
        );

        if (userResponse.data.exists) {
          await AsyncStorage.setItem(
            "accessToken",
            userResponse.data.tokens.accessToken
          );
          await AsyncStorage.setItem(
            "refreshToken",
            userResponse.data.tokens.refreshToken
          );
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        } else {
          navigation.navigate("PasswordVerification", { idToken });
        }
      } catch (error) {
        console.error("Error checking Google user", error);
        Alert.alert("Error", "An error occurred while checking user");
      }
    };

    if (response?.type === "success" && response.authentication?.idToken) {
      const { idToken } = response.authentication;
      handleGoogleLogin(idToken);
    }
  }, [response]);

  return { promptAsync };
};
