import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "./config";

export const storeTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  try {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
  } catch (error) {
    console.error("Failed to save tokens:", error);
  }
};

export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    return token;
  } catch (error) {
    console.error("Failed to retrieve access token:", error);
    return null;
  }
};

export const getRefreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem("refreshToken");
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

    const response = await fetch(`${config.serverUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();
    await storeTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    throw error;
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let accessToken = await getAccessToken();
  if (!accessToken) {
    accessToken = await refreshAccessToken();
  }

  if (!options.headers) {
    options.headers = {};
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  } as HeadersInit;

  let response = await fetch(url, options);

  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    } as HeadersInit;
    response = await fetch(url, options);
  }

  return response;
};

export const updateUserProfile = async (profile: FormData) => {
  const response = await fetchWithAuth(`${config.serverUrl}/auth/user`, {
    method: "PUT",
    body: profile,
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
};

export const getUserPosts = async () => {
  const response = await fetchWithAuth(`${config.serverUrl}/user/posts`);
  return response.json();
};

export const getUserProfile = async () => {
  const response = await fetchWithAuth(`${config.serverUrl}/auth/user`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }
  return response.json();
};

export const createPost = async (post: FormData): Promise<any> => {
  const response = await fetchWithAuth(`${config.serverUrl}/post`, {
    method: "POST",
    body: post,
  });

  if (!response.ok) {
    console.error("Failed to create post, status:", response.status);
    throw new Error("Failed to create post");
  }

  const responseJson = await response.json();
  console.log("Response from server:", responseJson);
  return responseJson;
};

export const updatePost = async (
  postId: string,
  post: FormData
): Promise<any> => {
  const response = await fetchWithAuth(`${config.serverUrl}/post/${postId}`, {
    method: "PUT",
    body: post,
  });

  if (!response.ok) {
    console.error("Failed to update post, status:", response.status);
    throw new Error("Failed to update post");
  }

  const responseJson = await response.json();
  console.log("Response from server:", responseJson);
  return responseJson;
};

export const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
};
