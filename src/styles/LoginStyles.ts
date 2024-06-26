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
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 10,
    width: "100%",
  },
  button: {
    marginTop: 20,
    width: "100%",
    borderRadius: 5,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
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
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
  },
  instructions: {
    marginBottom: 10,
    color: "gray",
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
});

export default styles;
