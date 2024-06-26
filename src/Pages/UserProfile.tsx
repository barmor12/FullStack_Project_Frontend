import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useFocusEffect,
  NavigationProp,
} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";

import {
  fetchUserProfile,
  saveUserProfile,
  saveUserProfilePic,
  validateCurrentPassword,
  checkUsernameAvailability,
} from "../services/UserProfileService";
import { RootStackParamList, User } from "../Types/types";
import styles from "../styles/UserProfileStyles";

import ProfilePicture from "../components/UserProfileComponents/ProfilePicture";
import UserProfileDetails from "../components/UserProfileComponents/UserProfileDetails";
import UserProfileEdit from "../components/UserProfileComponents/UserProfileEdit";
import LogoutButton from "../components/UserProfileComponents/LogoutButton";
import FullImageModal from "../components/HomeComponents/FullImageModal";
import { clearTokens, getAccessToken } from "src/services/authService";
import config from "src/Config/config";

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
  const [newPasswordStatus, setNewPasswordStatus] = useState<string>("");
  const [newPasswordStatusColor, setNewPasswordStatusColor] =
    useState<string>("");

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const userProfile = await fetchUserProfile();
      setUser(userProfile);
      setNewUsername(userProfile.nickname);
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

  const handleSaveProfile = async () => {
    if (newPassword && newPassword !== confirmNewPassword) {
      setError("The new passwords do not match");
      return;
    }

    if (newPassword && !/^(?=.*[A-Z]).*$/.test(newPassword)) {
      setError("The new password must contain at least one uppercase letter");
      return;
    }

    if (newUsername !== user?.nickname) {
      const isUsernameAvailable = await checkUsernameAvailability(newUsername);
      if (!isUsernameAvailable) {
        setUsernameStatus("Username is already taken");
        setUsernameStatusColor("red");
        return;
      } else {
        setUsernameStatus("Username is available");
        setUsernameStatusColor("green");
      }
    } else {
      setUsernameStatus("This is your current username");
      setUsernameStatusColor("blue");
    }

    const isCurrentPasswordValid = await validateCurrentPassword(
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      setPasswordStatus("Current password is incorrect");
      setPasswordStatusColor("red");
      return;
    } else {
      setPasswordStatus("Current password is correct");
      setPasswordStatusColor("green");
    }

    try {
      setLoading(true);
      const updatedUserProfile = await saveUserProfile(
        newUsername,
        currentPassword,
        newPassword,
        user?.email ?? ""
      );
      setUser(updatedUserProfile);
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

  const handleSaveProfilePic = async (uri: string) => {
    try {
      const updatedUserProfile = await saveUserProfilePic(uri);
      setUser(updatedUserProfile);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const resetForm = () => {
    setNewUsername(user?.nickname ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordStatus("");
    setUsernameStatus("");
    setNewPasswordStatus("");
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission to access gallery is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        handleSaveProfilePic(uri); // תמיד נשמור את התמונה דרך הפונקציה הזאת
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
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
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
                profilePic={user.profilePic || null}
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
                setUsernameStatus("");
                setUsernameStatusColor("");
              }}
              currentPassword={currentPassword}
              setCurrentPassword={(password) => {
                setCurrentPassword(password);
                setPasswordStatus("");
                setPasswordStatusColor("");
              }}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmNewPassword={confirmNewPassword}
              setConfirmNewPassword={setConfirmNewPassword}
              validateCurrentPassword={validateCurrentPassword}
              checkUsernameAvailability={checkUsernameAvailability}
              usernameStatus={usernameStatus}
              usernameStatusColor={usernameStatusColor}
              passwordStatus={passwordStatus}
              passwordStatusColor={passwordStatusColor}
              newPasswordStatus={newPasswordStatus}
              newPasswordStatusColor={newPasswordStatusColor}
              setNewPasswordStatus={setNewPasswordStatus}
              setNewPasswordStatusColor={setNewPasswordStatusColor}
              setUsernameStatus={setUsernameStatus}
              setUsernameStatusColor={setUsernameStatusColor}
              setPasswordStatus={setPasswordStatus}
              setPasswordStatusColor={setPasswordStatusColor}
            />
            <UserProfileEdit
              isEditing={isEditing}
              handleSaveProfile={handleSaveProfile}
              setIsEditing={setIsEditing}
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
          fullImageUri={user?.profilePic || ""}
          setModalVisible={setImageModalVisible}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default UserProfile;
