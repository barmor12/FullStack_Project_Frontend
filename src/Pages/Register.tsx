import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Types/types";
import { useGoogleAuth } from "../services/authService";
import {
  checkEmailAvailability,
  checkUsernameAvailability,
  handleSignUp,
  validatePassword,
} from "../services/RegisterService";
import { pickImage } from "../components/RegisterComponents/ImagePicker";
import styles from "../styles/RegisterStyles";

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

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => pickImage(setProfilePic)}
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
            checkEmailAvailability(text, setEmailStatus, setEmailStatusColor);
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
            checkUsernameAvailability(
              text,
              setUsernameStatus,
              setUsernameStatusColor
            );
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
            validatePassword(
              text,
              confirmPassword,
              setPasswordStatus,
              setPasswordStatusColor
            );
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
            validatePassword(
              password,
              text,
              setPasswordStatus,
              setPasswordStatusColor
            );
          }}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <Text style={{ color: passwordStatusColor || "black" }}>
          {passwordStatus}
        </Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={() =>
            handleSignUp(
              email,
              password,
              confirmPassword,
              name,
              profilePic,
              setError,
              navigation
            )
          }
          style={styles.button}
        >
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

export default RegisterScreen;
