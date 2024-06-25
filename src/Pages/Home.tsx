import React, { useState, useCallback } from "react";
import { View, FlatList, RefreshControl, Text, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/HomeStyles";
import {
  fetchPosts,
  handleDeletePost as deletePostService,
} from "../services/postsService";
import Header from "../components/HomeComponents/Header";
import PostItem from "../components/HomeComponents/PostItem";
import NewPostButton from "../components/HomeComponents/NewPostButton";
import FullImageModal from "../components/HomeComponents/FullImageModal";
import ModalOptions from "../components/HomeComponents/ModalOptions";
import { Post, User } from "../Types/types";
import { HomeScreenNavigationProp } from "../Types/types";

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [fullImageUri, setFullImageUri] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      fetchPosts(setUser, setPosts, setError);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(setUser, setPosts, setError).finally(() => setRefreshing(false));
  };

  const handleNavigateToPostDetails = (postId: string) => {
    navigation.navigate("PostDetails", { postId });
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

  const confirmDeletePost = () => {
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
            onPress: handleDeletePost,
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleDeletePost = async () => {
    if (selectedPostId) {
      await deletePostService(selectedPostId, setPosts, setError);
      closeOptionsModal();
    }
  };

  const openFullImage = (uri: string) => {
    setFullImageUri(uri);
    setImageModalVisible(true);
  };

  const openOptionsModal = (postId: string) => {
    setSelectedPostId(postId);
    setOptionsModalVisible(true);
  };

  const closeOptionsModal = () => {
    setSelectedPostId(null);
    setOptionsModalVisible(false);
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
        ListHeaderComponent={<Header user={user} />}
        ListHeaderComponentStyle={styles.listHeader}
        ListFooterComponent={
          error ? <Text style={styles.errorText}>{error}</Text> : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <NewPostButton />
      <FullImageModal
        modalVisible={imageModalVisible}
        fullImageUri={fullImageUri}
        setModalVisible={setImageModalVisible}
      />
      <ModalOptions
        visible={optionsModalVisible}
        closeOptionsModal={closeOptionsModal}
        onEditPress={handleEditPost}
        onDeletePress={confirmDeletePost}
      />
    </SafeAreaView>
  );
};

export default Home;
