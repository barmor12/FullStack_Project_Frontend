import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { createPost } from "../authService";
import { getAccessToken } from "../authService";

const CreatePost = () => {
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");

  const handleCreatePost = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        console.error("Token is null");
        Alert.alert("Error", "Token is null");
        return;
      }
      console.log("Token:", token);

      const response = await createPost(token, { message, sender });
      console.log("Response from createPost:", response);

      // בדיקה אם התגובה מהשרת מכילה את השדות _id, message ו-sender
      if (response && response._id && response.message && response.sender) {
        Alert.alert("Success", "Post created successfully");
      } else {
        console.error("Invalid response structure:", response);
        Alert.alert("Error", "Failed to create post");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      Alert.alert("Error", "Failed to create post");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter sender name"
        value={sender}
        onChangeText={setSender}
        style={styles.input}
      />
      <Button title="Create Post" onPress={handleCreatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default CreatePost;
