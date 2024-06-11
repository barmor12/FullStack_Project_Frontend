import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import config from "../Config/config";
import styles from "../styles/styles";

interface ProfilePictureProps {
  profilePic: string | null;
  onPress: () => void;
  pickImage: () => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePic,
  onPress,
  pickImage,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={{
            uri: profilePic ? `${config.serverUrl}${profilePic}` : undefined,
          }}
          style={styles.profilePic}
        />
        <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePicture;
