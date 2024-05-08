import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Image, Text } from "react-native";
import { Avatar } from "react-native-paper";
import { getAccessToken } from "../authService";

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch("http://192.168.0.140:3000/post", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Avatar.Image size={50} source={{ uri: item.userProfilePic }} />
      <Text style={styles.postUsername}>{item.username}</Text>
      <Image style={styles.postImage} source={{ uri: item.imageUri }} />
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  postUsername: {
    fontWeight: "bold",
  },
});

export default FeedScreen;
