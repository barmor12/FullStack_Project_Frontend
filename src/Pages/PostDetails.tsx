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
} from "../services/postsService";
import { SafeAreaView } from "react-native-safe-area-context";
import PostHeader from "../components/PostDetailsComponents/PostHeader";
import PostContent from "../components/PostDetailsComponents/PostContent";
import EditOptions from "../components/PostDetailsComponents/EditOptions";
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
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchPost = async () => {
    setError("");
    try {
      const user = await fetchUserData();
      setCurrentUser(user);

      const post = await fetchPostData(postId);
      setPost(post);
      navigation.setOptions({ title: post.sender?.nickname || "Post Details" });
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
    Alert.alert("Image clicked", uri);
    // Here you can navigate to a full image view or do something else
  };

  const handleEditPost = () => {
    navigation.navigate("CreatePost", {
      postId: post._id,
      isEdit: true,
    });
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
            onImagePress={openFullImage} // העברת הפונקציה
          />
          {currentUser && currentUser._id === post.sender._id && (
            <EditOptions
              onEditPress={handleEditPost}
              onDeletePress={confirmDeletePost}
            />
          )}
        </View>
      ) : (
        <Text style={styles.errorText}>{error ? error : "Loading..."}</Text>
      )}
    </SafeAreaView>
  );
};

export default PostDetails;
