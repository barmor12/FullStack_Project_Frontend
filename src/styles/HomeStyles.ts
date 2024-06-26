import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 10,
  },
  profileIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  profileText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  list: {
    paddingBottom: 100,
  },
  listHeader: {
    marginBottom: 20,
  },
  post: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profilePicPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#cccccc",
    marginRight: 10,
  },
  postHeaderText: {
    flex: 1,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  sender: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postDate: {
    fontSize: 12,
    color: "#888",
  },
  message: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
  postImage: {
    marginTop: 10,
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  newPostContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#f0f2f5",
  },
  newPostButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullImage: {
    width: width,
    height: height,
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  headerContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
    flexDirection: "column",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  headerSubText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  userContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: "contain",
    borderRadius: 100,
  },
});

export default styles;
