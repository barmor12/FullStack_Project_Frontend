import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import config from "../Config/config";
import { fetchWithAuth } from "../services/authService";
import { HomeScreenNavigationProp, Post, User } from "../Types/types";
import {
  fetchUserPosts,
  handleDeletePost as deletePostService,
} from "../services/postsService";
import PostItem from "../components/HomeComponents/PostItem";
import ModalOptions from "../components/HomeComponents/ModalOptions";
import styles from "../styles/PostsStyles";

const Posts: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserPosts(setUser, setPosts, setError);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserPosts(setUser, setPosts, setError).finally(() =>
      setRefreshing(false)
    );
  };

  const handleNavigateToPostDetails = (postId: string) => {
    navigation.navigate("PostDetails", { postId });
  };

  const openFullImage = (uri: string) => {
    // Implement full image opening functionality here
  };

  const openOptionsModal = (postId: string) => {
    setSelectedPostId(postId);
    setModalVisible(true);
  };

  const closeOptionsModal = () => {
    setSelectedPostId(null);
    setModalVisible(false);
  };

  const handleEditPost = () => {
    if (selectedPostId) {
      navigation.navigate("CreatePost", {
        postId: selectedPostId,
        isEdit: true,
      });
      closeOptionsModal();
    }
  };

  const handleDeletePost = async () => {
    if (selectedPostId) {
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
            onPress: async () => {
              await deletePostService(selectedPostId, setPosts, setError);
              closeOptionsModal();
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }
  };

  const renderItem = ({ item }: { item: Post }) => (
    <PostItem
      item={item}
      user={user}
      handleNavigateToPostDetails={handleNavigateToPostDetails}
      handleEditPost={() => openOptionsModal(item._id)}
      handleDeletePost={() => openOptionsModal(item._id)}
      openFullImage={openFullImage}
      openOptionsModal={openOptionsModal}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          error ? <Text style={styles.errorText}>{error}</Text> : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <ModalOptions
        visible={modalVisible}
        closeOptionsModal={closeOptionsModal}
        handleEditPost={handleEditPost}
        handleDeletePost={handleDeletePost}
      />
    </SafeAreaView>
  );
};

export default Posts;
