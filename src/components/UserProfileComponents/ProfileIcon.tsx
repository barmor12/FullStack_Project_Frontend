import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { User } from "../../Types/types";
import styles from "../../styles/HomeStyles";
import config from "../../Config/config";

type ProfileIconProps = {
  user: User;
  handleNavigateToUserProfile: () => void;
};

const ProfileIcon: React.FC<ProfileIconProps> = ({
  user,
  handleNavigateToUserProfile,
}) => {
  return (
    <TouchableOpacity
      style={styles.profileIconContainer}
      onPress={handleNavigateToUserProfile}
    >
      <Image
        source={{ uri: `${config.serverUrl}${user.profilePic}` }}
        style={styles.profileIcon}
      />
      <Text style={styles.profileText}>Profile</Text>
    </TouchableOpacity>
  );
};

export default ProfileIcon;
