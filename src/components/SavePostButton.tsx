import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

interface SavePostButtonProps {
  loading: boolean;
  onPress: () => void;
  isEdit: boolean;
}

const SavePostButton: React.FC<SavePostButtonProps> = ({
  loading,
  onPress,
  isEdit,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{isEdit ? "Update" : "Post"}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SavePostButton;
