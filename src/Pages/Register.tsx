import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Types/types";
import config from "../Config/config";
import * as ImagePicker from "expo-image-picker";
import { useGoogleAuth } from "../services/authService";

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [emailStatus, setEmailStatus] = useState<string>("");
  const [emailStatusColor, setEmailStatusColor] = useState<string>("");
  const [usernameStatus, setUsernameStatus] = useState<string>("");
  const [usernameStatusColor, setUsernameStatusColor] = useState<string>("");
  const [passwordStatus, setPasswordStatus] = useState<string>("");
  const [passwordStatusColor, setPasswordStatusColor] = useState<string>("");
  const { promptAsync } = useGoogleAuth();

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const checkEmailAvailability = async (email: string) => {
    try {
      const response = await fetch(`${config.serverUrl}/auth/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (result.available) {
          setEmailStatus("Email is available");
          setEmailStatusColor("green");
        } else {
          setEmailStatus("Email is already taken");
          setEmailStatusColor("red");
        }
      } catch (error) {
        console.error("Failed to parse JSON:", text);
        setEmailStatus("Error checking email availability");
        setEmailStatusColor("red");
      }
    } catch (error) {
      console.error("Error checking email availability:", error);
      setEmailStatus("Error checking email availability");
      setEmailStatusColor("red");
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    try {
      const response = await fetch(`${config.serverUrl}/auth/check-username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (result.available) {
          setUsernameStatus("Username is available");
          setUsernameStatusColor("green");
        } else {
          setUsernameStatus("Username is already taken");
          setUsernameStatusColor("red");
        }
      } catch (error) {
        console.error("Failed to parse JSON:", text);
        setUsernameStatus("Error checking username availability");
        setUsernameStatusColor("red");
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
      setUsernameStatus("Error checking username availability");
      setUsernameStatusColor("red");
    }
  };

  const validatePassword = (password: string, confirmPassword: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    if (password !== confirmPassword) {
      setPasswordStatus("Passwords do not match");
      setPasswordStatusColor("red");
    } else if (!hasUpperCase) {
      setPasswordStatus("Password must contain at least one uppercase letter");
      setPasswordStatusColor("red");
    } else {
      setPasswordStatus("Passwords match");
      setPasswordStatusColor("green");
    }
  };

  const handleSignUp = async () => {
    setError("");
    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("nickname", name);
      if (profilePic) {
        const fileName = profilePic.split("/").pop();
        const fileType = profilePic.split(".").pop();
        formData.append("profilePic", {
          uri: profilePic,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await fetch(`${config.serverUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const json = await response.json();
      if (response.status === 201) {
        navigation.navigate("Login");
      } else {
        setError(json.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error or server is down");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={pickImage}
          style={styles.profileImageContainer}
        >
          <View style={styles.profileImageWrapper}>
            <Image
              source={
                profilePic
                  ? { uri: profilePic }
                  : require("../assets//Profile pic.webp")
              }
              style={styles.profileImage}
            />
          </View>
        </TouchableOpacity>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            checkEmailAvailability(text);
          }}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
        />
        <Text style={{ color: emailStatusColor || "black" }}>
          {emailStatus}
        </Text>
        <TextInput
          label="Username"
          value={name}
          onChangeText={(text) => {
            setName(text);
            checkUsernameAvailability(text);
          }}
          mode="outlined"
          style={styles.input}
        />
        <Text style={{ color: usernameStatusColor || "black" }}>
          {usernameStatus}
        </Text>
        <Text style={styles.instructions}>
          Password must be at least 8 characters long and contain at least one
          uppercase letter.
        </Text>
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text, confirmPassword);
          }}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            validatePassword(password, text);
          }}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <Text style={{ color: passwordStatusColor || "black" }}>
          {passwordStatus}
        </Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button mode="contained" onPress={handleSignUp} style={styles.button}>
          Register
        </Button>
        <Button
          mode="contained"
          onPress={() => promptAsync()}
          style={styles.button}
        >
          Sign up with Google
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    marginBottom: 10,
    width: "100%",
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
  profileImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 100,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  instructions: {
    marginBottom: 10,
    color: "gray",
  },
});

export default RegisterScreen;
