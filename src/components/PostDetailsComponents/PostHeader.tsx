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
  return (
    <View style={styles.header}>
      {sender && sender.profilePic ? (
        <Image
          source={{ uri: `${config.serverUrl}${sender.profilePic}` }}
          style={styles.profilePic}
        />
      ) : (
        <View style={styles.placeholderPic} />
      )}
      <View style={styles.headerTextContainer}>
        <Text style={styles.senderName}>{sender.name}</Text>
        <Text style={styles.postDate}>
          {new Date(createdAt).toLocaleDateString()}{" "}
          {new Date(createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

export default PostHeader;
