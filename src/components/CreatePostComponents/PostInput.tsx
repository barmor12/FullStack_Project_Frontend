import React from "react";
import { TextInput, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
});

export default PostInput;
