import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import config from "../config";
import { getAccessToken } from "../authService";
import { RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type PostsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostDetails"
>;

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const navigation = useNavigation<PostsScreenNavigationProp>();

  useEffect(() => {
    const fetchPosts = async () => {
      setError("");
      try {
        const token = await getAccessToken();
        const response = await fetch(`${config.serverUrl}/post`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const json = await response.json();
        if (response.status === 200) {
          setPosts(json);
        } else {
          setError(json.error || "Failed to fetch posts!");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Network error or server is down");
        }
      }
    };

    fetchPosts();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("PostDetails", { postId: item._id })}
    >
      <View style={styles.post}>
        {item.sender && item.sender.profilePic && (
          <Image
            source={{ uri: item.sender.profilePic }}
            style={styles.profilePic}
          />
        )}
        {item.sender && <Text style={styles.sender}>{item.sender.name}</Text>}
        <Text style={styles.message}>{item.message}</Text>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  list: {
    paddingBottom: 20,
  },
  post: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  sender: {
    fontWeight: "bold",
  },
  message: {
    marginTop: 5,
  },
  postImage: {
    marginTop: 10,
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default Posts;
