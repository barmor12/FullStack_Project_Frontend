import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Button as RNButton,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import config from "../config";
import { getAccessToken } from "../authService";
import * as ImagePicker from "expo-image-picker";

const CreatePost: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const navigation = useNavigation();

  const handleCreatePost = async () => {
    setError("");
    try {
      const token = await getAccessToken();
      const formData = new FormData();
      formData.append("message", message);
      if (imageUri) {
        const fileName = imageUri.split("/").pop();
        const fileType = imageUri.split(".").pop();
        formData.append("image", {
          uri: imageUri,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await fetch(`${config.serverUrl}/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await response.json();
      if (response.status === 201) {
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
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
      <RNButton title="Pick an image from camera roll" onPress={pickImage} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      )}
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
  button: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default CreatePost;
