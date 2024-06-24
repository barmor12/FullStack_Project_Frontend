import React from "react";
import { Button } from "react-native-paper";
import styles from "../../styles/UserProfileStyles";

interface UserProfileEditProps {
  isEditing: boolean;
  handleSaveProfile: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

const UserProfileEdit: React.FC<UserProfileEditProps> = ({
  isEditing,
  handleSaveProfile,
  setIsEditing,
}) => {
  return (
    <>
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
    </>
  );
};

export default UserProfileEdit;
