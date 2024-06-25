import React from "react";
import { TextInput, View, Text } from "react-native";
import { Button } from "react-native-paper";
import styles from "../../styles/UserProfileStyles";

interface UserProfileEditProps {
  isEditing: boolean;
  handleSaveProfile: () => void;
  setIsEditing: (isEditing: boolean) => void;
  oldPassword: string;
  setOldPassword: (password: string) => void;
}

const UserProfileEdit: React.FC<UserProfileEditProps> = ({
  isEditing,
  handleSaveProfile,
  setIsEditing,
  oldPassword,
  setOldPassword,
}) => {
  return (
    <>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Old Password"
          />
          <Button
            mode="contained"
            onPress={handleSaveProfile}
            style={styles.button}
          >
            Save
          </Button>
        </>
      ) : (
        <Button
          mode="contained"
          onPress={() => setIsEditing(true)}
          style={styles.button}
        >
          Edit Profile
        </Button>
      )}
    </>
  );
};

export default UserProfileEdit;
