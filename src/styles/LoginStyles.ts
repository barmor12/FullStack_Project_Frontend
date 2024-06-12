import { StyleSheet } from "react-native";

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
});

export default LoginStyles;
