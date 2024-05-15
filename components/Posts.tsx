import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Alert } from "react-native";
import { getAccessToken } from "../authService";

interface User {
  name: string;
  profilePic: string;
}

interface Post {
  sender: User;
  message: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");

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
      const response = await fetch("http://192.168.0.140:3000/post", {
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
        posts.map((post, index) => (
          <View key={index} style={styles.post}>
            <Image
              source={{ uri: post.sender.profilePic }}
              style={styles.profilePic}
            />
            <Text>{post.sender.name}</Text>
            <Text>{post.message}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  post: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Posts;
