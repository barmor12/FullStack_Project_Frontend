import React, { useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../Types/types";
import { useGoogleAuth } from "../services/authService";
import { handleLogin } from "../services/loginService";
import LoginInput from "../components/LoginComponents/LoginInput";
import LoginButton from "../components/LoginComponents/LoginButton";
import GoogleSignInButton from "../components/GoogleSignInButton";
import styles from "../styles/RegisterStyles";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { promptAsync } = useGoogleAuth();

  const handleLoginPress = async () => {
    const loginError = await handleLogin(email, password, navigation);
    if (loginError) {
      setError(loginError);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setPassword("");
      setError("");
    }, [])
  );

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <LoginInput label="Email" value={email} onChangeText={setEmail} />
      <LoginInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <LoginButton onPress={handleLoginPress} />
      <GoogleSignInButton onPress={() => promptAsync()} />
      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text style={styles.signUpText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
