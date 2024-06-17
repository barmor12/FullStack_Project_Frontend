import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  postContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  placeholderPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  senderName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postDate: {
    fontSize: 12,
    color: "#888",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postImage: {
    width: Dimensions.get("window").width - 30,
    height: Dimensions.get("window").width - 30,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "contain",
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  editOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  editButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#dc3545",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  editModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  pickImageButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  pickImageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default styles;
