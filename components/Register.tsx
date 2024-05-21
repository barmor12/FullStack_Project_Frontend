import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Button as RNButton,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import config from "../config";
import * as ImagePicker from "expo-image-picker";
import { useGoogleAuth } from "../authService"; // הוספת התחברות דרך גוגל

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
  const [name, setName] = useState<string>(""); // שדה שם משתמש חדש
  const [error, setError] = useState<string>("");
  const { promptAsync } = useGoogleAuth(); // הוספת התחברות דרך גוגל

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
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
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
      <Button mode="elevated" onPress={pickImage} style={styles.button}>
        Upload Picture
      </Button>
      {profilePic ? (
        <Image source={{ uri: profilePic }} style={styles.image} />
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Register
      </Button>
      <Button
        mode="contained"
        onPress={() => promptAsync()} // כפתור התחברות דרך גוגל
        style={styles.button}
      >
        Sign up with Google
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default RegisterScreen;
