import config from "../Config/config";
import { getAccessToken, refreshAccessToken, clearTokens } from "./authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchUserProfile = async () => {
  let token = await getAccessToken();
  let response = await fetch(`${config.serverUrl}/auth/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  let responseText = await response.text();

  if (response.status === 401 && responseText.includes("Token expired")) {
    token = await refreshAccessToken();
    response = await fetch(`${config.serverUrl}/auth/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    responseText = await response.text();
  }

  const json = JSON.parse(responseText);

  if (response.status === 200) {
    return {
      ...json,
      profilePic: json.profilePic.startsWith("http")
        ? json.profilePic
        : `${config.serverUrl}${json.profilePic}`,
    };
  } else {
    throw new Error(json.error || "Failed to fetch user profile!");
  }
};

export const saveUserProfile = async (
  newUsername: string,
  currentPassword: string,
  newPassword: string | null,
  userEmail: string
) => {
  const token = await getAccessToken();
  const response = await fetch(`${config.serverUrl}/auth/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: newUsername,
      email: userEmail,
      oldPassword: currentPassword,
      newPassword: newPassword,
    }),
  });

  const json = await response.json();

  return {
    ...json,
    profilePic: json.profilePic.startsWith("http")
      ? json.profilePic
      : `${config.serverUrl}${json.profilePic}`,
  };
};

export const saveUserProfilePic = async (uri: string) => {
  const formData = new FormData();
  formData.append("profilePic", {
    uri,
    type: "image/jpeg",
    name: "profile.jpg",
  } as any);

  const token = await getAccessToken();
  const response = await fetch(`${config.serverUrl}/auth/profile-pic`, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await response.json();

  return {
    ...json,
    profilePic: json.profilePic.startsWith("http")
      ? json.profilePic
      : `${config.serverUrl}${json.profilePic}`,
  };
};

export const validateCurrentPassword = async (password: string) => {
  const token = await AsyncStorage.getItem("accessToken");
  const response = await fetch(`${config.serverUrl}/auth/validate-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });
  const result = await response.json();
  return result.valid;
};

export const checkUsernameAvailability = async (username: string) => {
  const response = await fetch(`${config.serverUrl}/auth/check-username`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  const result = await response.json();
  return result.available;
};
