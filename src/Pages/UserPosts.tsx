import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Alert } from "react-native";
import { getAccessToken, getUserPosts } from "../services/authService";
import { Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types"; // Import the type from your types file

interface User {
  _id: string;
  name: string;
  profilePic: string;
}

interface Post {
  _id: string;
  message: string;
  image: string;
  sender: User;
}

type UserPostsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserPosts"
>;

interface Props {
  navigation: UserPostsScreenNavigationProp;
}

const UserPosts: React.FC<Props> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    const token = await getAccessToken();
    if (!token) {
      console.error("Token is null");
      Alert.alert("Error", "Token is null");
      return;
    }
    try {
      const response = await getUserPosts(token);
      setPosts(response);
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
          <View key={post._id} style={styles.post}>
            <Image source={{ uri: post.image }} style={styles.image} />
            <Text>{post.message}</Text>
            <Button
              mode="text"
              onPress={() =>
                navigation.navigate("EditPost", { postId: post._id })
              }
            >
              Edit
            </Button>
            <Button
              mode="text"
              onPress={() =>
                navigation.navigate("DeletePost", { postId: post._id })
              }
            >
              Delete
            </Button>
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default UserPosts;
