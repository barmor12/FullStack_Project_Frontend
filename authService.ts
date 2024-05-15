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
