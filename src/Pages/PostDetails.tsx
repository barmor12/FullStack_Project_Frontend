// src/screens/PostDetails.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import {
  RouteProp,
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Types/types";
import {
  fetchUserData,
  fetchPostData,
  handleDeletePost,
  handleUpdatePost,
} from "../services/postsService";
import { SafeAreaView } from "react-native-safe-area-context";
import PostHeader from "../components/PostHeader";
import PostContent from "../components/PostContent";
import EditOptions from "../components/EditOptions";
import EditModal from "../components/EditModal";
import styles from "../styles/PostDetailsStyles";

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
      const user = await fetchUserData();
      setCurrentUser(user);

      const post = await fetchPostData(postId);
      setPost(post);
      setEditedMessage(post.message);
      navigation.setOptions({ title: post.sender?.name || "Post Details" });
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

  const handleUpdatePostWrapper = async (
    message: string,
    image: string | null
  ) => {
    setError("");
    try {
      const success = await handleUpdatePost(postId, message, image);
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
          <PostHeader sender={post.sender} createdAt={post.createdAt} />
          <PostContent
            image={post.image}
            message={post.message}
            onImagePress={openFullImage}
          />
          {currentUser && currentUser._id === post.sender._id && (
            <EditOptions
              onEditPress={openEditModal}
              onDeletePress={confirmDeletePost}
            />
          )}
        </View>
      ) : (
        <Text style={styles.errorText}>{error ? error : "Loading..."}</Text>
      )}
      <EditModal
        visible={editModalVisible}
        onClose={closeEditModal}
        onUpdate={handleUpdatePostWrapper}
        postMessage={editedMessage}
        postImage={selectedImage}
      />
    </SafeAreaView>
  );
};

export default PostDetails;
