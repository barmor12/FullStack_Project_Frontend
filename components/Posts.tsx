import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getAccessToken } from "../authService";
import { useNavigation } from "@react-navigation/native";
import { PostsScreenNavigationProp, Post } from "../types";
import config from "../config";

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const navigation = useNavigation<PostsScreenNavigationProp>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const token = await getAccessToken();
    if (token === null) {
      console.error("Token is null");
      Alert.alert("Error", "Token is null");
      return;
    }
    console.log("Token:", token);
    try {
      const response = await fetch(`${config.serverUrl}/post`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      console.log("Response text:", text);
      if (text === "[]") {
        setError("No posts available");
        return;
      }
      const data = JSON.parse(text);
      console.log("Data:", data); // בדיקה של מבנה הנתונים המתקבלים
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError("Failed to fetch posts: " + errorMessage);
      Alert.alert("Error", "Failed to fetch posts: " + errorMessage);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        posts.map((post) => (
          <TouchableOpacity
            key={post._id} // שימוש ב _id כפי שהתקבל מהשרת
            style={styles.post}
            onPress={() =>
              navigation.navigate("PostDetails", { postId: post._id })
            } // העברת הפרטים של הפוסט למסך החדש
          >
            <Image
              source={{ uri: post.sender.profilePic }}
              style={styles.profilePic}
            />
            <Text style={styles.name}>{post.sender.name}</Text>
            <Text style={styles.messagePreview}>{post.message}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  post: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  messagePreview: {
    fontSize: 16,
    color: "#495057",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Posts;
