import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import config from "../../Config/config";
import styles from "../../styles/PostDetailsStyles";

const PostContent = ({
  image,
  message,
  onImagePress,
}: {
  image: string;
  message: string;
  onImagePress: (uri: string) => void;
}) => {
  return (
    <View style={styles.content}>
      {image && (
        <TouchableOpacity
          onPress={() => onImagePress(`${config.serverUrl}${image}`)}
        >
          <Image
            source={{ uri: `${config.serverUrl}${image}` }}
            style={styles.postImage}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default PostContent;
