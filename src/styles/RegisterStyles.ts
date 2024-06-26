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
    marginTop: 20,
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
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default styles;
