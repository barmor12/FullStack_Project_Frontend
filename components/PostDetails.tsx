import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import config from "../config";
import { getAccessToken } from "../authService";

type PostDetailsScreenRouteProp = RouteProp<RootStackParamList, "PostDetails">;

const PostDetails: React.FC = () => {
  const route = useRoute<PostDetailsScreenRouteProp>();
  const { postId } = route.params;
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPost = async () => {
      setError("");
      try {
        const token = await getAccessToken();
        const response = await fetch(`${config.serverUrl}/post/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        if (response.status === 200) {
          setPost(json);
        } else {
          setError(json.error || "Failed to fetch post!");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Network error or server is down");
        }
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <ScrollView style={styles.container}>
      {post ? (
        <>
          <View style={styles.item}>
            <Text style={styles.label}>Post By:</Text>
            <Text style={styles.value}>{post.sender}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>The Post:</Text>
            <Text style={styles.value}>{post.message}</Text>
          </View>
        </>
      ) : (
        <Text>{error ? error : "Loading..."}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    marginBottom: 300,
  },
  label: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  value: {
    fontSize: 20,
    textAlign: "right",
  },
});

export default PostDetails;
