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
    width: 350,
    height: 350,
    marginBottom: 30,
    alignSelf: "center",
    borderRadius: 100,
  },
});

export default LoginStyles;
