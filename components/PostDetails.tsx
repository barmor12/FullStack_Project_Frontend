import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type PostDetailsScreenRouteProp = RouteProp<RootStackParamList, "PostDetails">;

const PostDetails = () => {
  const route = useRoute<PostDetailsScreenRouteProp>();
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.id}>ID: {post._id}</Text>
      <Image
        source={{ uri: post.sender.profilePic }}
        style={styles.profilePic}
      />
      <Text style={styles.title}>{post.sender.name}</Text>
      <Text style={styles.author}>נכתב על ידי: {post.sender.name}</Text>
      <Text style={styles.message}>{post.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  id: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#343a40",
  },
  author: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#495057",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    color: "#495057",
    paddingHorizontal: 20,
  },
});

export default PostDetails;
