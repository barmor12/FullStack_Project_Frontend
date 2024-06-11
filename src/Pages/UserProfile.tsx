import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Modal,
  Alert,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  getAccessToken,
  updateUserProfile,
  refreshAccessToken,
  clearTokens,
} from "../services/authService";
import config from "../Config/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList, User } from "../Types/types";
import ProfilePicture from "../components/ProfilePicture";
import UserProfileDetails from "../components/UserProfileDetails";
import UserProfileEdit from "../components/UserProfileEdit";
import LogoutButton from "../components/LogoutButton";
import styles from "../styles/UserProfileStyles";
import { Button } from "react-native-paper";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
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

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchUserProfile();
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
      formData.append("email", user?.email ?? "");
      if (user?.profilePic) {
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
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            name: newName,
            surname: newSurname,
            nickname: newNickname,
          };
        }
        return prevUser;
      });
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
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            profilePic: selectedImage,
          };
        }
        return prevUser;
      });
      const formData = new FormData();
      formData.append("name", user?.name ?? "");
      formData.append("surname", user?.surname ?? "");
      formData.append("nickname", user?.nickname ?? "");
      formData.append("email", user?.email ?? "");
      formData.append("profilePic", {
        uri: selectedImage,
        type: "image/jpeg",
        name: "profile.jpg",
      } as any);
      await updateUserProfile(formData);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              let token = await getAccessToken();
              await fetch(`${config.serverUrl}/auth/logout`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              await clearTokens();
              navigation.navigate("Login");
            } catch (error) {
              console.error("Logout failed:", error);
              setError("Logout failed. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ProfilePicture
            profilePic={user.profilePic}
            onPress={() => setModalVisible(true)}
            pickImage={pickImage}
          />
          <Text style={styles.userName}>
            {user.name} {user.surname}
          </Text>
          <UserProfileDetails
            user={user}
            isEditing={isEditing}
            newNickname={newNickname}
            setNewNickname={setNewNickname}
          />
          <UserProfileEdit
            isEditing={isEditing}
            handleSaveProfile={handleSaveProfile}
            setIsEditing={setIsEditing}
          />
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Posts")}
            style={styles.button}
          >
            My Posts
          </Button>
          <LogoutButton handleLogout={handleLogout} />
        </ScrollView>
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
            <Button onPress={pickImage}>Pick Image</Button>
            <Button onPress={() => setModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserProfile;
