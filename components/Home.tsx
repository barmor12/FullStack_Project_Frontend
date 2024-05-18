import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome } from "@expo/vector-icons"; // Import FontAwesome icons
import config from "../config";
import { getAccessToken } from "../authService";
import { HomeScreenNavigationProp, Post, User } from "../types";

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fullImageUri, setFullImageUri] = useState<string>("");

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setError("");
      try {
        const token = await getAccessToken();
        const userResponse = await fetch(`${config.serverUrl}/auth/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`User response status: ${userResponse.status}`);

        const postsResponse = await fetch(`${config.serverUrl}/post`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`Posts response status: ${postsResponse.status}`);

        if (!userResponse.ok || !postsResponse.ok) {
          throw new Error(
            `Network response was not ok: user: ${userResponse.status}, posts: ${postsResponse.status}`
          );
        }

        const userJson = await userResponse.json();
        const postsJson = await postsResponse.json();

        if (userResponse.status === 200 && postsResponse.status === 200) {
          setUser(userJson);
          setPosts(postsJson);
        } else {
          setError(userJson.error || "Failed to fetch data!");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Network error or server is down");
        }
      }
    };

    fetchUserAndPosts();
  }, []);

  const handleNavigateToUserProfile = () => {
    navigation.navigate("UserProfile");
  };
  const handleNavigateToCreatePost = (postId?: string) => {
    navigation.navigate("CreatePost", {
      postId,
      onPostCreated: (newPost: Post) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      },
    });
  };

  const openFullImage = (uri: string) => {
    setFullImageUri(uri);
    setModalVisible(true);
  };

  const handleEditPost = (postId: string) => {
    // הוסף כאן את הלוגיקה לעריכת הפוסט
    handleNavigateToCreatePost(postId);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const token = await getAccessToken();
      const response = await fetch(`${config.serverUrl}/post/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
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

  const renderItem = ({ item }: { item: Post }) => (
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
          {item.sender && <Text style={styles.sender}>{item.sender.name}</Text>}
          <Text style={styles.postDate}>
            {new Date(item.createdAt).toLocaleDateString()}{" "}
            {new Date(item.createdAt).toLocaleTimeString()}
          </Text>
        </View>
        {user && user._id === item.sender._id && (
          <View style={styles.postActions}>
            <TouchableOpacity onPress={() => handleEditPost(item._id)}>
              <FontAwesome name="edit" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeletePost(item._id)}>
              <FontAwesome name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={styles.message}>{item.message}</Text>
      {item.image && (
        <TouchableOpacity
          onPress={() => openFullImage(`${config.serverUrl}${item.image}`)}
        >
          <Image
            source={{ uri: `${config.serverUrl}${item.image}` }}
            style={styles.postImage}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {user && (
        <TouchableOpacity
          style={styles.profileIconContainer}
          onPress={handleNavigateToUserProfile}
        >
          <Image
            source={{ uri: `${config.serverUrl}${user.profilePic}` }}
            style={styles.profileIcon}
          />
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          error ? <Text style={styles.errorText}>{error}</Text> : null
        }
      />
      <View style={styles.newPostContainer}>
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => handleNavigateToCreatePost()}
        >
          <AntDesign name="pluscircleo" size={24} color="white" />
          <Text style={styles.buttonText}>Create a New Post</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: fullImageUri }} style={styles.fullImage} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 10,
  },
  profileIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
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
  postActions: {
    flexDirection: "row",
    alignItems: "center",
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
  newPostContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "#f0f2f5",
  },
  newPostButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
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
  fullImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Home;
