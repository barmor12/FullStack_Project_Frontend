import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  RouteProp,
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { RootStackParamList } from "../Types/types";
import config from "../Config/config";
import { getAccessToken } from "../services/authService";
import { SafeAreaView } from "react-native-safe-area-context";

type PostDetailsScreenRouteProp = RouteProp<RootStackParamList, "PostDetails">;

const PostDetails: React.FC = () => {
  const route = useRoute<PostDetailsScreenRouteProp>();
  const navigation = useNavigation();
  const { postId } = route.params;
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fullImageUri, setFullImageUri] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    setError("");
    try {
      const token = await getAccessToken();
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
    setModalVisible(true);
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
            <View>
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
        </View>
      ) : (
        <Text style={styles.errorText}>{error ? error : "Loading..."}</Text>
      )}

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  postContainer: {
    margin: 10,
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
  senderName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postDate: {
    fontSize: 12,
    color: "#888",
  },
  content: {
    marginTop: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
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

export default PostDetails;