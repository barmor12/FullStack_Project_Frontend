import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Types/types";
import { useGoogleAuth } from "../services/authService";
import { handleLogin } from "../services/loginService";
import LoginInput from "../components//LoginComponents/LoginInput";
import LoginButton from "../components/LoginComponents/LoginButton";
import RegisterButton from "../components/LoginComponents/RegisterButton";
import GoogleSignInButton from "../components/GoogleSignInButton";
import styles from "../styles/LoginStyles";

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
    }
  };

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
      <RegisterButton onPress={() => navigation.navigate("Register")} />
      <GoogleSignInButton onPress={() => promptAsync()} />
    </View>
  );
};

export default LoginScreen;
