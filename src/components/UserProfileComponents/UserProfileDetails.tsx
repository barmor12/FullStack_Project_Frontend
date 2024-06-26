import React, { useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { User } from "../../Types/types";
import styles from "../../styles/UserProfileStyles";

interface UserProfileDetailsProps {
  user: User;
  isEditing: boolean;
  newUsername: string;
  setNewUsername: (name: string) => void;
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (password: string) => void;
  validateCurrentPassword: (password: string) => Promise<boolean>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  usernameStatus: string;
  usernameStatusColor: string;
  passwordStatus: string;
  passwordStatusColor: string;
  newPasswordStatus: string;
  newPasswordStatusColor: string;
  setNewPasswordStatus: (status: string) => void;
  setNewPasswordStatusColor: (color: string) => void;
  setUsernameStatus: (status: string) => void;
  setUsernameStatusColor: (color: string) => void;
  setPasswordStatus: (status: string) => void;
  setPasswordStatusColor: (color: string) => void;
}

const UserProfileDetails: React.FC<UserProfileDetailsProps> = ({
  user,
  isEditing,
  newUsername,
  setNewUsername,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  validateCurrentPassword,
  checkUsernameAvailability,
  usernameStatus,
  usernameStatusColor,
  passwordStatus,
  passwordStatusColor,
  newPasswordStatus,
  newPasswordStatusColor,
  setNewPasswordStatus,
  setNewPasswordStatusColor,
  setUsernameStatus,
  setUsernameStatusColor,
  setPasswordStatus,
  setPasswordStatusColor,
}) => {
  useEffect(() => {
    const validatePassword = async () => {
      if (currentPassword) {
        const isValid = await validateCurrentPassword(currentPassword);
        if (isValid) {
          setPasswordStatus("Current password is correct");
          setPasswordStatusColor("green");
        } else {
          setPasswordStatus("Current password is incorrect");
          setPasswordStatusColor("red");
        }
      }
    };

    validatePassword();
  }, [
    currentPassword,
    validateCurrentPassword,
    setPasswordStatus,
    setPasswordStatusColor,
  ]);

  useEffect(() => {
    if (newPassword && confirmNewPassword) {
      if (newPassword === confirmNewPassword) {
        setNewPasswordStatus("Passwords match");
        setNewPasswordStatusColor("green");
      } else {
        setNewPasswordStatus("Passwords do not match");
        setNewPasswordStatusColor("red");
      }
    }
  }, [
    newPassword,
    confirmNewPassword,
    setNewPasswordStatus,
    setNewPasswordStatusColor,
  ]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (newUsername) {
        if (newUsername === user.nickname) {
          setUsernameStatus("This is your current username");
          setUsernameStatusColor("blue");
          return;
        }
        const isAvailable = await checkUsernameAvailability(newUsername);
        if (isAvailable) {
          setUsernameStatus("Username is available");
          setUsernameStatusColor("green");
        } else {
          setUsernameStatus("Username is already taken");
          setUsernameStatusColor("red");
        }
      }
    };

    checkAvailability();
  }, [
    newUsername,
    checkUsernameAvailability,
    setUsernameStatus,
    setUsernameStatusColor,
    user.nickname,
  ]);

  return (
    <View style={styles.details}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>
      <Text style={styles.label}>UserName:</Text>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={newUsername}
            onChangeText={setNewUsername}
          />
          <Text style={{ color: usernameStatusColor || "black" }}>
            {usernameStatus}
          </Text>
        </>
      ) : (
        <Text style={styles.value}>{user.nickname}</Text>
      )}
      {isEditing && (
        <>
          <Text style={styles.label}>Current Password:</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <Text style={{ color: passwordStatusColor || "black" }}>
            {passwordStatus}
          </Text>

          <Text style={styles.label}>New Password:</Text>
          <Text style={styles.instructions}>
            Password must contain at least one uppercase letter.
          </Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Text style={styles.label}>Confirm New Password:</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <Text style={{ color: newPasswordStatusColor || "black" }}>
            {newPasswordStatus}
          </Text>
        </>
      )}
    </View>
  );
};

export default UserProfileDetails;
