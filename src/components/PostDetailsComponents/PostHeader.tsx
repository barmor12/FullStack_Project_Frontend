import React from "react";
import { View, Text, Image } from "react-native";
import config from "../../Config/config";
import styles from "../../styles/PostDetailsStyles";

const PostHeader = ({
  sender,
  createdAt,
}: {
  sender: any;
  createdAt: string;
}) => {
  const profilePicUrl = sender.profilePic.startsWith("http")
    ? sender.profilePic
    : `${config.serverUrl}${sender.profilePic}`;

  console.log("Profile Pic URL:", profilePicUrl);

  return (
    <View style={styles.header}>
      {sender && sender.profilePic ? (
        <Image
          source={{ uri: profilePicUrl }}
          style={styles.profilePic}
          onError={(e) =>
            console.error("Failed to load profile picture", e.nativeEvent.error)
          }
        />
      ) : (
        <View style={styles.placeholderPic} />
      )}
      <View style={styles.headerTextContainer}>
        <Text style={styles.senderName}>{sender.nickname}</Text>
        <Text style={styles.postDate}>
          {new Date(createdAt).toLocaleDateString()}{" "}
          {new Date(createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

export default PostHeader;
