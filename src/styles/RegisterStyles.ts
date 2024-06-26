import { StyleSheet } from "react-native";

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
    marginTop: 10,
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
    width: 300,
    height: 300,
    borderRadius: 300,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  instructions: {
    marginBottom: 10,
    color: "gray",
  },
  googleButton: {
    marginTop: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 15,
  },
  registerContainer: {
    position: "absolute",
    bottom: 50,
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
  logo: {
    width: 250,
    height: 250,
    marginBottom: 30,
    alignSelf: "center",
    borderRadius: 125,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 40,
    right: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
  },
});

export default styles;
