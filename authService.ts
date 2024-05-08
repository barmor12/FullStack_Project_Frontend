import AsyncStorage from "@react-native-async-storage/async-storage";

const storeTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

const getAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    return accessToken;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};

export { storeTokens, getAccessToken };
