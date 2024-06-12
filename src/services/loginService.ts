import { storeTokens } from "./authService";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Types/types";
import config from "../Config/config";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

export const handleLogin = async (
  email: string,
  password: string,
  navigation: LoginScreenNavigationProp
): Promise<string | null> => {
  try {
    const response = await fetch(`${config.serverUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const json = await response.json();
    if (response.status === 200) {
      await storeTokens(json.accessToken, json.refreshToken);
      navigation.navigate("Main");
      console.log("Login successful!");
      return null;
    } else {
      return json.error || "Login failed!";
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    } else {
      return "Network error or server is down";
    }
  }
};
