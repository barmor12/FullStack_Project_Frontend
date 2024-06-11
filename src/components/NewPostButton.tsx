import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import styles from "../styles/HomeStyles";

type NewPostButtonProps = {
  handleNavigateToCreatePost: () => void;
};

const NewPostButton: React.FC<NewPostButtonProps> = ({
  handleNavigateToCreatePost,
}) => {
  return (
    <View style={styles.newPostContainer}>
      <TouchableOpacity
        style={styles.newPostButton}
        onPress={handleNavigateToCreatePost}
      >
        <AntDesign name="pluscircleo" size={24} color="white" />
        <Text style={styles.buttonText}>Create a New Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewPostButton;
