import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  imagePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
});

export default styles;
