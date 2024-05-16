import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import config from "../config";
import { getAccessToken } from "../authService";

const CreatePost: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [sender, setSender] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigation = useNavigation();

  const handleCreatePost = async () => {
    setError("");
    try {
      const token = await getAccessToken();
      const response = await fetch(`${config.serverUrl}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, sender }),
      });
      const json = await response.json();
      if (response.status === 201) {
        console.log("Response from server:", json);
        navigation.navigate("Posts");
      } else {
        setError(json.error || "Failed to create post!");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Network error or server is down");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Message"
        value={message}
        onChangeText={setMessage}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Sender"
        value={sender}
        onChangeText={setSender}
        mode="outlined"
        style={styles.input}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button mode="contained" onPress={handleCreatePost} style={styles.button}>
        Create Post
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default CreatePost;
