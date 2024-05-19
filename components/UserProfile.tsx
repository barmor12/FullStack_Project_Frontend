import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
  Button,
  RefreshControl,
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

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
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
      const updateData: any = {
        name: newName,
        profilePic: user.profilePic,
        email: user.email,
      };
      if (oldPassword && newPassword) {
        updateData.oldPassword = oldPassword;
        updateData.newPassword = newPassword;
      }
      await updateUserProfile(updateData);
      setUser((prevUser: any) => ({
        ...prevUser,
        name: newName,
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
      await updateUserProfile({
        name: user.name,
        profilePic: selectedImage,
        email: user.email,
      });
    }
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <Text style={styles.postMessage}>{item.message}</Text>
      {item.image && (
        <Image
          source={{ uri: `${config.serverUrl}${item.image}` }}
          style={styles.postImage}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{
                uri: user.profilePic
                  ? `${config.serverUrl}${user.profilePic}`
                  : undefined,
              }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
          <Text style={styles.label}>Name:</Text>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
              />
              <Text style={styles.label}>Old Password:</Text>
              <TextInput
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
              />
              <Text style={styles.label}>New Password:</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <Text style={styles.label}>Confirm New Password:</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </>
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}
          {isEditing ? (
            <Button title="Save" onPress={handleSaveProfile} />
          ) : (
            <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
          )}
          <Text style={styles.postsHeader}>Your Posts:</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f2f5",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
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
    marginBottom: 10,
  },
  post: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  postMessage: {
    fontSize: 16,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
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
