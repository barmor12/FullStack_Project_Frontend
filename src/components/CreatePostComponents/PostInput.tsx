import React from "react";
import { TextInput, StyleSheet } from "react-native";
import styles from "../../styles/CreatePostStyles";

interface PostInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const PostInput: React.FC<PostInputProps> = ({ value, onChangeText }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder="What's on your mind?"
      value={value}
      onChangeText={onChangeText}
    />
  );
};

export default PostInput;
