import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  RefreshControl,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  fetchWithAuth,
  getAccessToken,
  updateUserProfile,
  getUserPosts,
  refreshAccessToken,
  clearTokens,
} from "../authService";
import config from "../config";
import { Post } from "../types";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput, Card, Title, Paragraph } from "react-native-paper";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newSurname, setNewSurname] = useState<string>("");
  const [newNickname, setNewNickname] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchUserProfile();
    await fetchUserPosts();
  };

  const fetchUserProfile = async () => {
    setError("");
    setLoading(true);
    try {
      let token = await getAccessToken();
      let response = await fetch(`${config.serverUrl}/auth/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let responseText = await response.text();
      console.log("Response Headers:", response.headers);
      console.log("Response Text:", responseText);

      if (response.status === 401 && responseText.includes("Token expired")) {
        try {
          token = await refreshAccessToken();
          response = await fetch(`${config.serverUrl}/auth/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          responseText = await response.text();
        } catch (refreshError) {
          console.error("Failed to refresh access token:", refreshError);
          await clearTokens();
          setError("Session expired. Please log in again.");
          return;
        }
      }

      try {
        const json = JSON.parse(responseText);
        if (response.status === 200) {
          setUser(json);
          setNewName(json.name);
          setNewSurname(json.surname);
          setNewNickname(json.nickname);
        } else {
          setError(json.error || "Failed to fetch user profile!");
        }
      } catch (parseError) {
        if (parseError instanceof Error) {
          console.error("Failed to parse response:", parseError);
          setError(`Failed to parse response: ${parseError.message}`);
        } else {
          console.error("Unknown error while parsing response");
          setError("Unknown error while parsing response");
        }
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

  const fetchUserPosts = async () => {
    setError("");
    setRefreshing(true);
    try {
      const userPosts = await getUserPosts();
      setPosts(userPosts);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Network error or server is down");
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveProfile = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", newName);
      formData.append("surname", newSurname);
      formData.append("nickname", newNickname);
      formData.append("email", user.email);
      if (user.profilePic) {
        formData.append("profilePic", {
          uri: user.profilePic,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any);
      }
      if (oldPassword && newPassword) {
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);
      }
      await updateUserProfile(formData);
      setUser((prevUser: any) => ({
        ...prevUser,
        name: newName,
        surname: newSurname,
        nickname: newNickname,
      }));
      setIsEditing(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setUser((prevUser: any) => ({
        ...prevUser,
        profilePic: selectedImage,
      }));
      // save the new profile picture to the server
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("surname", user.surname);
      formData.append("nickname", user.nickname);
      formData.append("email", user.email);
      formData.append("profilePic", {
        uri: selectedImage,
        type: "image/jpeg",
        name: "profile.jpg",
      } as any);
      await updateUserProfile(formData);
    }
  };

  const handleEditPost = (postId: string) => {
    // Handle navigation to edit post screen
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetchWithAuth(
        `${config.serverUrl}/post/${postId}`,
        {
          method: "DELETE",
        }
      );
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
    <Card style={styles.post}>
      <Card.Content>
        <Title>{item.sender.name}</Title>
        <Paragraph>{item.message}</Paragraph>
      </Card.Content>
      {item.image && (
        <Card.Cover source={{ uri: `${config.serverUrl}${item.image}` }} />
      )}
      <Card.Actions>
        <Button onPress={() => handleEditPost(item._id)}>Edit</Button>
        <Button onPress={() => handleDeletePost(item._id)}>Delete</Button>
      </Card.Actions>
    </Card>
  );

  const handleLogout = async () => {
    await clearTokens();
    // Handle navigation to login screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={{
                  uri: user.profilePic
                    ? `${config.serverUrl}${user.profilePic}`
                    : undefined,
                }}
                style={styles.profilePic}
              />
              <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
                <MaterialIcons name="edit" size={24} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
            <Text style={styles.userName}>
              {user.name} {user.surname}
            </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
            <Text style={styles.label}>Nickname:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={newNickname}
                onChangeText={setNewNickname}
              />
            ) : (
              <Text style={styles.value}>{user.nickname}</Text>
            )}
          </View>
          {isEditing ? (
            <Button
              mode="contained"
              onPress={handleSaveProfile}
              style={styles.button}
            >
              Save
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={() => setIsEditing(true)}
              style={styles.button}
            >
              Edit Profile
            </Button>
          )}
          <Button mode="contained" onPress={handleLogout} style={styles.button}>
            Logout
          </Button>
          <Text style={styles.postsHeader}>My Posts:</Text>
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
            }
          />
        </>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>
            <Button title="Pick Image" onPress={pickImage} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
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
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#6200ee",
    marginBottom: 10,
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  details: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200ee",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  postsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginHorizontal: 20,
  },
  post: {
    margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default UserProfile;
