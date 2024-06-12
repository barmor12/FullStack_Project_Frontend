import React, { useState } from "react";
import { View, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Types/types";
import { useGoogleAuth } from "../services/authService";
import { handleLogin } from "../services/loginService";
import LoginInput from "../components/LoginInput";
import LoginButton from "../components/LoginButton";
import RegisterButton from "../components/RegisterButton";
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
