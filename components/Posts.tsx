import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
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
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<PostsScreenNavigationProp>();

  useEffect(() => {
    const fetchPosts = async () => {
      setError("");
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("PostDetails", { postId: item._id })}
    >
      <View style={styles.post}>
        <View style={styles.postHeader}>
          {item.sender && item.sender.profilePic ? (
            <Image
              source={{ uri: `${config.serverUrl}${item.sender.profilePic}` }}
              style={styles.profilePic}
            />
          ) : (
            <View style={styles.profilePicPlaceholder} />
          )}
          <View>
            {item.sender && (
              <Text style={styles.sender}>{item.sender.name}</Text>
            )}
            <Text style={styles.postDate}>
              {new Date(item.createdAt).toLocaleDateString()}{" "}
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        </View>
        <Text style={styles.message}>{item.message}</Text>
        {item.image && (
          <Image
            source={{ uri: `${config.serverUrl}${item.image}` }}
            style={styles.postImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  list: {
    paddingBottom: 20,
  },
  post: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profilePicPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#cccccc",
    marginRight: 10,
  },
  sender: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postDate: {
    fontSize: 12,
    color: "#888",
  },
  message: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
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
    textAlign: "center",
  },
});

export default Posts;
