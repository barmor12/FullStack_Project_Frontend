import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Types/types";
import config from "../Config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PasswordVerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PasswordVerification"
>;

type PasswordVerificationScreenRouteProp = RouteProp<
  RootStackParamList,
  "PasswordVerification"
>;

type Props = {
  navigation: PasswordVerificationScreenNavigationProp;
  route: PasswordVerificationScreenRouteProp;
};

const PasswordVerificationScreen: React.FC<Props> = ({ route }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const navigation = useNavigation<PasswordVerificationScreenNavigationProp>();

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePassword(text, confirmPassword);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    validatePassword(password, text);
  };

  const validatePassword = (pass: string, confirmPass: string) => {
    const passwordRegex = /^(?=.*[A-Z]).*$/;
    const isPasswordValid = passwordRegex.test(pass);
    const isConfirmPasswordValid = pass === confirmPass;

    setPasswordValid(isPasswordValid);
    setConfirmPasswordValid(isConfirmPasswordValid);

    if (!isPasswordValid) {
      setPasswordMessage("Password must contain at least one uppercase letter");
    } else if (!isConfirmPasswordValid) {
      setPasswordMessage("Passwords do not match");
    } else {
      setPasswordMessage("");
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please enter and confirm your password");
      return;
    }

    if (!passwordValid || !confirmPasswordValid) {
      Alert.alert("Error", passwordMessage);
      return;
    }

    try {
      const { idToken } = route.params;
      const response = await fetch(`${config.serverUrl}/auth/google/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken, password }),
      });
      const data = await response.json();
      if (data.accessToken && data.refreshToken) {
        await AsyncStorage.setItem("accessToken", data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      } else {
        Alert.alert("Error", "Failed to receive tokens from server");
      }
    } catch (error) {
      console.error("Error logging in with Google", error);
      Alert.alert("Error", "An error occurred while logging in");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Password must contain at least one uppercase letter
      </Text>
      <TextInput
        value={password}
        onChangeText={handlePasswordChange}
        placeholder="Password"
        secureTextEntry
        style={[
          styles.input,
          {
            borderColor: passwordValid ? "green" : "red",
          },
        ]}
      />
      <TextInput
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        placeholder="Confirm Password"
        secureTextEntry
        style={[
          styles.input,
          {
            borderColor: confirmPasswordValid ? "green" : "red",
          },
        ]}
      />
      <Text style={{ color: "red" }}>{passwordMessage}</Text>
      <Button title="Submit" onPress={handlePasswordSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});

export default PasswordVerificationScreen;
