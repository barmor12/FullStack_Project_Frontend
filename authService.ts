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
      body: JSON.stringify({ refreshToken }), // Ensure the refreshToken is sent in the body
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

export const updateUserProfile = async (profile: {
  name: string;
  profilePic: string;
  email: string;
}) => {
  const response = await fetchWithAuth(`${config.serverUrl}/auth/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });
  return response.json();
};

export const createPost = async (post: {
  message: string;
  sender: string;
  image?: string;
}): Promise<any> => {
  const response = await fetchWithAuth(`${config.serverUrl}/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    console.error("Failed to create post, status:", response.status);
    throw new Error("Failed to create post");
  }

  const responseJson = await response.json();
  console.log("Response from server:", responseJson);
  return responseJson;
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

export const updatePost = async (
  postId: string,
  post: { message: string; image?: string }
): Promise<any> => {
  const response = await fetchWithAuth(`${config.serverUrl}/post/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    console.error("Failed to update post, status:", response.status);
    throw new Error("Failed to update post");
  }

  const responseJson = await response.json();
  console.log("Response from server:", responseJson);
  return responseJson;
};
