import React, { useState, useCallback } from "react";
import { View, FlatList, RefreshControl, Text, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/HomeStyles";
import {
  fetchPosts,
  handleDeletePost as deletePostService,
} from "../services/postsService";
import Header from "../components/Header";
import PostItem from "../components/PostItem";
import NewPostButton from "../components/NewPostButton";
import FullImageModal from "../components/FullImageModal";
import ModalOptions from "../components/ModalOptions";
import { Post, User } from "../Types/types";
import { HomeScreenNavigationProp } from "../Types/types";

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
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
      setModalVisible(false); // סגור את המודל לאחר ניווט
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
              setModalVisible(false); // סגור את המודל לאחר מחיקה
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }
  };

  const openFullImage = (uri: string) => {
    setFullImageUri(uri);
    setModalVisible(true);
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
        modalVisible={modalVisible}
        fullImageUri={fullImageUri}
        setModalVisible={setModalVisible}
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

export default Home;
