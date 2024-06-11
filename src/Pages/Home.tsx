import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchUserData,
  fetchPostsData,
  deletePost,
} from "../services/homeService";
import { HomeScreenNavigationProp, Post, User } from "../Types/types";
import PostItem from "../components/PostItem";
import ProfileIcon from "../components/ProfileIcon";
import NewPostButton from "../components/NewPostButton";
import FullImageModal from "../components/FullImageModal";
import styles from "../styles/HomeStyles";

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fullImageUri, setFullImageUri] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchPosts = async () => {
    setError("");
    try {
      const userData = await fetchUserData();
      const postsData = await fetchPostsData();
      setUser(userData);
      setPosts(postsData);
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

  const handleNavigateToUserProfile = () => {
    navigation.navigate("UserProfile");
  };

  const handleNavigateToCreatePost = (postId?: string) => {
    navigation.navigate("CreatePost", {
      postId,
    });
  };

  const handleNavigateToPostDetails = (postId: string) => {
    navigation.navigate("PostDetails", {
      postId,
    });
  };

  const openFullImage = (uri: string) => {
    setFullImageUri(uri);
    setModalVisible(true);
  };

  const handleEditPost = (postId: string) => {
    handleNavigateToCreatePost(postId);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await deletePost(postId);
      if (response) {
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
    <PostItem
      item={item}
      user={user}
      handleNavigateToPostDetails={handleNavigateToPostDetails}
      handleEditPost={handleEditPost}
      handleDeletePost={handleDeletePost}
      openFullImage={openFullImage}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Welcome to the Home Page!</Text>
      <Text style={styles.headerSubText}>
        Here you can find all the latest posts from all users.
      </Text>
      {user && (
        <ProfileIcon
          user={user}
          handleNavigateToUserProfile={handleNavigateToUserProfile}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={styles.listHeader}
        ListFooterComponent={
          error ? <Text style={styles.errorText}>{error}</Text> : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <NewPostButton handleNavigateToCreatePost={handleNavigateToCreatePost} />
      <FullImageModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        fullImageUri={fullImageUri}
      />
    </SafeAreaView>
  );
};

export default Home;
