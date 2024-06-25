import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  createPost,
  updatePost,
  getAccessToken,
} from "../services/authService";
import {
  CreatePostScreenNavigationProp,
  CreatePostScreenRouteProp,
} from "../Types/types";
import config from "../Config/config";
import PostInput from "../components/CreatePostComponents/PostInput";
import PostImage from "../components/CreatePostComponents/PostImage";
import SavePostButton from "../components/CreatePostComponents/SavePostButton";
import styles from "../styles/CreatePostStyles";
import { Button } from "react-native-paper";

const CreatePost = () => {
  const navigation = useNavigation<CreatePostScreenNavigationProp>();
  const route = useRoute<CreatePostScreenRouteProp>();
  const { postId, isEdit } = route.params || {};

  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [originalImage, setOriginalImage] = useState<string | null>(null);

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
          setOriginalImage(post.image || null); // Keep the original image
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

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

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

      if (image && image !== originalImage) {
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{isEdit ? "Edit Post" : "Create Post"}</Text>
      <PostInput value={message} onChangeText={setMessage} />
      {image && <PostImage uri={image} />}
      <View style={styles.imagePickerContainer}>
        <Button
          icon="image"
          mode="contained"
          onPress={pickImage}
          style={styles.imageButton}
        >
          Pick an Image
        </Button>
        <Button
          icon="camera"
          mode="contained"
          onPress={takePhoto}
          style={styles.imageButton}
        >
          Take a Photo
        </Button>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <SavePostButton
        loading={loading}
        onPress={handleSavePost}
        isEdit={!!postId}
      />
    </SafeAreaView>
  );
};

export default CreatePost;
