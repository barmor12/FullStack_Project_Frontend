import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import {
  RouteProp,
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Types/types";
import config from "../Config/config";
import { getAccessToken } from "../services/authService";
import {
  fetchUserData,
  handleDeletePost,
  handleUpdatePost,
} from "../services/postsService";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

type PostDetailsScreenRouteProp = RouteProp<RootStackParamList, "PostDetails">;
type PostDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PostDetails"
>;

const PostDetails: React.FC = () => {
  const route = useRoute<PostDetailsScreenRouteProp>();
  const navigation = useNavigation<PostDetailsNavigationProp>();
  const { postId } = route.params;
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fullImageUri, setFullImageUri] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editedMessage, setEditedMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchPost = async () => {
    setError("");
    try {
      const token = await getAccessToken();
      const user = await fetchUserData();
      setCurrentUser(user);

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
        setEditedMessage(json.message);
        navigation.setOptions({ title: json.sender?.name || "Post Details" });
      } else {
        setError(json.error || "Failed to fetch post!");
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

  useFocusEffect(
    useCallback(() => {
      fetchPost();
    }, [postId])
  );

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const openFullImage = (uri: string) => {
    setFullImageUri(uri);
    setEditModalVisible(true);
  };

  const openEditModal = () => {
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpdatePostWrapper = async () => {
    setError("");
    try {
      const success = await handleUpdatePost(
        postId,
        editedMessage,
        selectedImage
      );
      if (success) {
        fetchPost();
        closeEditModal();
      } else {
        setError("Failed to update post");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Network error or server is down");
      }
    }
  };

  const confirmDeletePost = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: handleDeletePostWrapper,
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeletePostWrapper = async () => {
    try {
      await handleDeletePost(postId, () => setPost(null), setError);
      navigation.goBack();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Network error or server is down");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : post ? (
        <View style={styles.postContainer}>
          <View style={styles.header}>
            {post.sender && post.sender.profilePic ? (
              <Image
                source={{ uri: `${config.serverUrl}${post.sender.profilePic}` }}
                style={styles.profilePic}
              />
            ) : (
              <View style={styles.placeholderPic} />
            )}
            <View style={styles.headerTextContainer}>
              <Text style={styles.senderName}>{post.sender.name}</Text>
              <Text style={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString()}{" "}
                {new Date(post.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          </View>
          <View style={styles.content}>
            {post.image && (
              <TouchableOpacity
                onPress={() =>
                  openFullImage(`${config.serverUrl}${post.image}`)
                }
              >
                <Image
                  source={{ uri: `${config.serverUrl}${post.image}` }}
                  style={styles.postImage}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.message}>{post.message}</Text>
          </View>
          {currentUser && currentUser._id === post.sender._id && (
            <View style={styles.editOptions}>
              <TouchableOpacity
                onPress={openEditModal}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Edit Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={confirmDeletePost}
              >
                <Text style={styles.deleteButtonText}>Delete Post</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.errorText}>{error ? error : "Loading..."}</Text>
      )}

      <Modal
        visible={editModalVisible}
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.editModalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeEditModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Edit your post message"
            value={editedMessage}
            onChangeText={setEditedMessage}
          />
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            />
          )}
          <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
            <Text style={styles.pickImageButtonText}>
              Pick an image from gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdatePostWrapper}
          >
            <Text style={styles.updateButtonText}>Update Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={closeEditModal}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  postContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  placeholderPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  senderName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postDate: {
    fontSize: 12,
    color: "#888",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postImage: {
    width: Dimensions.get("window").width - 30,
    height: Dimensions.get("window").width - 30,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "contain",
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  editOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  editButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#dc3545",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  editModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  pickImageButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  pickImageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PostDetails;
