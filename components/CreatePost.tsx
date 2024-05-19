import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { createPost, updatePost, getAccessToken } from "../authService";
import {
  RootStackParamList,
  CreatePostScreenNavigationProp,
  Post,
} from "../types";
import config from "../config";

type CreatePostScreenRouteProp = RouteProp<RootStackParamList, "CreatePost">;

const CreatePost = () => {
  const navigation = useNavigation<CreatePostScreenNavigationProp>();
  const route = useRoute<CreatePostScreenRouteProp>();
  const { postId, onPostCreated } = route.params || {};

  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (postId) {
      const fetchPostData = async () => {
        try {
          const token = await getAccessToken();
          const response = await fetch(`${config.serverUrl}/post/${postId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const post = await response.json();
          setMessage(post.message);
          setImage(post.image || null);
        } catch (error) {
          setError("Failed to fetch post data");
        }
      };
      fetchPostData();
    }
  }, [postId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSavePost = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`${config.serverUrl}/auth/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userJson = await response.json();
      const userId = userJson._id;

      let postResponse;
      const formData = new FormData();
      formData.append("message", message);
      if (image) {
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "photo.jpg",
        } as any);
      }

      if (postId) {
        postResponse = await updatePost(postId, formData);
      } else {
        formData.append("sender", userId);
        postResponse = await createPost(formData);
      }

      if (onPostCreated) {
        onPostCreated(postResponse);
      }

      navigation.goBack();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to save post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={message}
        onChangeText={setMessage}
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Pick an image from gallery" onPress={pickImage} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSavePost}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{postId ? "Update" : "Post"}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
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
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default CreatePost;
