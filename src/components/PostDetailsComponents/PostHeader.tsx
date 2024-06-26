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
  console.log(`${config.serverUrl}${sender.profilePic}`); // הדפסת ה-URL לתמונת הפרופיל בקונסול

  return (
    <View style={styles.header}>
      {sender && sender.profilePic ? (
        <Image
          source={{ uri: `${config.serverUrl}${sender.profilePic}` }}
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
