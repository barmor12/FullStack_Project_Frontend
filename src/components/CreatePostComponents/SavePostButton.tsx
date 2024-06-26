import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import styles from "../../styles/CreatePostStyles";

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

export default SavePostButton;
