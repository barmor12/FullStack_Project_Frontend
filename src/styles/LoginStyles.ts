import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff", // Set background color to white
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 30,
    alignSelf: "center",
    borderRadius: 300,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  registerContainer: {
    position: "absolute",
    bottom: 50, // Adjusted value to move it higher
    alignSelf: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#000",
  },
  signUpText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    marginBottom: 10,
    width: "100%",
  },
  button: {
    marginTop: 10,
    width: "100%",
    borderRadius: 5,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6200ee",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  googleButton: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DB4437",
    borderRadius: 5,
    paddingVertical: 10,
  },
  googleButtonText: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 16,
  },
  scrollViewContainer: {
    flexGrow: 1,
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
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  instructions: {
    marginBottom: 10,
    color: "gray",
  },
});

export default styles;
