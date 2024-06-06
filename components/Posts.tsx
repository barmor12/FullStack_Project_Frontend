import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import config from "../config";
import { fetchWithAuth } from "../authService";
import { HomeScreenNavigationProp, Post, User } from "../types";

const Posts: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchPosts = async () => {
    setError("");
    try {
      const userResponse = await fetchWithAuth(`${config.serverUrl}/auth/user`);
      const postsResponse = await fetchWithAuth(
        `${config.serverUrl}/post/user`
      );

      if (userResponse.status !== 200 || postsResponse.status !== 200) {
        throw new Error(
          `Network response was not ok: user: ${userResponse.status}, posts: ${postsResponse.status}`
        );
      }

      setUser(userResponse.data);
      setPosts(postsResponse.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Network error or server is down");
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts().finally(() => setRefreshing(false));
  };

  const handleEditPost = (postId: string) => {
    navigation.navigate("CreatePost", { postId, isEdit: true });
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetchWithAuth(
        `${config.serverUrl}/post/${postId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } else {
        setError("Failed to delete post");
      }
    } catch (error) {
      setError("Network error or server is down");
    }
  };

  const openOptionsModal = (postId: string) => {
    setSelectedPostId(postId);
    setModalVisible(true);
  };

  const closeOptionsModal = () => {
    setSelectedPostId(null);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Post }) => (
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
          <View style={styles.postHeaderText}>
            {item.sender && (
              <Text style={styles.sender}>{item.sender.name}</Text>
            )}
            <Text style={styles.postDate}>
              {new Date(item.createdAt).toLocaleDateString()}{" "}
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
          {user && item.sender && user._id === item.sender._id && (
            <TouchableOpacity onPress={() => openOptionsModal(item._id)}>
              <Entypo name="dots-three-horizontal" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.message}>{item.message}</Text>
        {item.image && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PostDetails", { postId: item._id })
            }
          >
            <Image
              source={{ uri: `${config.serverUrl}${item.image}` }}
              style={styles.postImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          error ? <Text style={styles.errorText}>{error}</Text> : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeOptionsModal}
      >
        <View style={styles.modalContainer}>
          {selectedPostId && (
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  handleEditPost(selectedPostId);
                  closeOptionsModal();
                }}
              >
                <Text style={styles.optionText}>Edit Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  handleDeletePost(selectedPostId);
                  closeOptionsModal();
                }}
              >
                <Text style={styles.optionText}>Delete Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, styles.cancelButton]}
                onPress={closeOptionsModal}
              >
                <Text style={styles.optionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 10,
  },
  list: {
    paddingBottom: 100,
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
  postHeaderText: {
    flex: 1,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  optionsContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  cancelButton: {
    borderBottomWidth: 0,
  },
});

export default Posts;
