import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Types/types";
import config from "../Config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, HelperText } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

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
      <MaterialIcons
        name="lock"
        size={100}
        color="#6200ee"
        style={styles.icon}
      />
      <Text style={styles.header}>Set Your Password</Text>
      <Text style={styles.subHeader}>
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
      <HelperText type="error" visible={!!passwordMessage}>
        {passwordMessage}
      </HelperText>
      <Button
        mode="contained"
        onPress={handlePasswordSubmit}
        style={styles.button}
      >
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  icon: {
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#6200ee",
  },
  subHeader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#6c757d",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
  },
});

export default PasswordVerificationScreen;
