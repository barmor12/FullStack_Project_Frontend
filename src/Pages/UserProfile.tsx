import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";

import {
  getAccessToken,
  refreshAccessToken,
  clearTokens,
} from "../services/authService";
import config from "../Config/config";
import { RootStackParamList, User } from "../Types/types";
import styles from "../styles/UserProfileStyles";

import ProfilePicture from "../components/UserProfileComponents/ProfilePicture";
import UserProfileDetails from "../components/UserProfileComponents/UserProfileDetails";
import UserProfileEdit from "../components/UserProfileComponents/UserProfileEdit";
import LogoutButton from "../components/UserProfileComponents/LogoutButton";
import FullImageModal from "../components/HomeComponents/FullImageModal";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false);
  const [passwordStatus, setPasswordStatus] = useState<string>("");
  const [passwordStatusColor, setPasswordStatusColor] = useState<string>("");
  const [usernameStatus, setUsernameStatus] = useState<string>("");
  const [usernameStatusColor, setUsernameStatusColor] = useState<string>("");

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
          setNewUsername(json.name);
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
    if (newPassword && newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    // בדיקת זמינות שם משתמש לפני שמירה
    try {
      const response = await fetch(`${config.serverUrl}/auth/check-username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
      });
      const result = await response.json();
      if (!result.available) {
        setUsernameStatus("Username is already taken");
        setUsernameStatusColor("red");
        return;
      } else {
        setUsernameStatus("Username is available");
        setUsernameStatusColor("green");
      }
    } catch (error) {
      setError("Error checking username availability");
      return;
    }

    // בדיקת סיסמא נוכחית לפני שמירה
    try {
      const response = await fetch(
        `${config.serverUrl}/auth/validate-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: currentPassword }),
        }
      );
      const result = await response.json();
      if (!result.valid) {
        setPasswordStatus("Current password is incorrect");
        setPasswordStatusColor("red");
        return;
      } else {
        setPasswordStatus("Current password is correct");
        setPasswordStatusColor("green");
      }
    } catch (error) {
      setError("Error validating current password");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", newUsername);
      formData.append("email", user?.email ?? "");
      if (user?.profilePic) {
        formData.append("profilePic", {
          uri: user.profilePic,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any);
      }
      if (currentPassword && newPassword) {
        formData.append("oldPassword", currentPassword);
        formData.append("newPassword", newPassword);
      }
      const response = await fetch(`${config.serverUrl}/auth/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const json = await response.json();
      setUser(json);
      setIsEditing(false);
      resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const resetForm = () => {
    setNewUsername(user?.name ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordStatus("");
    setUsernameStatus("");
  };

  const validateCurrentPassword = async (password: string) => {
    try {
      const response = await fetch(
        `${config.serverUrl}/auth/validate-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );
      const result = await response.json();
      if (result.valid) {
        setPasswordStatus("Current password is correct");
        setPasswordStatusColor("green");
      } else {
        setPasswordStatus("Current password is incorrect");
        setPasswordStatusColor("red");
      }
    } catch (error) {
      setPasswordStatus("Error validating password");
      setPasswordStatusColor("red");
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (username === user?.name) {
      setUsernameStatus("This is your current username");
      setUsernameStatusColor("green");
      return;
    }
    try {
      const response = await fetch(`${config.serverUrl}/auth/check-username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      const result = await response.json();
      if (result.available) {
        setUsernameStatus("Username is available");
        setUsernameStatusColor("green");
      } else {
        setUsernameStatus("Username is already taken");
        setUsernameStatusColor("red");
      }
    } catch (error) {
      setUsernameStatus("Error checking username availability");
      setUsernameStatusColor("red");
    }
  };

  const pickImage = async () => {
    try {
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
        formData.append("username", user?.name ?? "");
        formData.append("email", user?.email ?? "");
        formData.append("profilePic", {
          uri: selectedImage,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any);
        await fetch(`${config.serverUrl}/auth/user`, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
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
            } catch (error: unknown) {
              if (error instanceof Error) {
                setError(error.message);
              } else {
                setError("An unknown error occurred");
              }
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
              <ProfilePicture
                profilePic={user.profilePic}
                onPress={() => setModalVisible(true)}
                pickImage={pickImage}
              />
            </TouchableOpacity>
            <UserProfileDetails
              user={user}
              isEditing={isEditing}
              newUsername={newUsername}
              setNewUsername={(username) => {
                setNewUsername(username);
                checkUsernameAvailability(username);
              }}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmNewPassword={confirmNewPassword}
              setConfirmNewPassword={setConfirmNewPassword}
              validateCurrentPassword={validateCurrentPassword}
              usernameStatus={usernameStatus}
              usernameStatusColor={usernameStatusColor}
              passwordStatus={passwordStatus}
              passwordStatusColor={passwordStatusColor}
            />
            <UserProfileEdit
              isEditing={isEditing}
              handleSaveProfile={handleSaveProfile}
              setIsEditing={setIsEditing}
              oldPassword={currentPassword}
              setOldPassword={setCurrentPassword}
            />
            {isEditing && (
              <Button
                mode="contained"
                onPress={handleCancel}
                style={styles.button}
              >
                Cancel
              </Button>
            )}
            <LogoutButton handleLogout={handleLogout} />
          </ScrollView>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
        <FullImageModal
          modalVisible={imageModalVisible}
          fullImageUri={user?.profilePic ?? ""}
          setModalVisible={setImageModalVisible}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default UserProfile;
