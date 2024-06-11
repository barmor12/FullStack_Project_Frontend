import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
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
  const [profilePic, setProfilePic] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { promptAsync } = useGoogleAuth();

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      if (profilePic) {
        const fileName = profilePic.split("/").pop();
        const fileType = profilePic.split(".").pop();
        formData.append("profilePic", {
          uri: profilePic,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      console.log(formData);

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
      console.log("Selected image URI:", result.assets[0].uri); // דוגמה להוספת הדפסת כתובת התמונה
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
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Username"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
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
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 5,
  },
  cameraIcon: {
    width: 30,
    height: 30,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default RegisterScreen;
