import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const updateUserProfile = async (
  token: string,
  profile: { name: string; profilePic: string; email: string }
) => {
  const response = await fetch("http://192.168.0.140:3000/user/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  return response.json();
};

// authService.ts
export const createPost = async (
  token: string,
  post: { message: string; sender: string }
): Promise<any> => {
  const response = await fetch("http://192.168.0.140:3000/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export const getUserPosts = async (token: string) => {
  const response = await fetch("http://192.168.0.140:3000/user/post", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getUserProfile = async (token: string) => {
  const response = await fetch("http://192.168.0.140:3000/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }
  return response.json();
};
