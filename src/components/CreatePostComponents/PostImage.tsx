import React from "react";
import { Image, StyleSheet } from "react-native";
import styles from "../../styles/CreatePostStyles";

interface PostImageProps {
  uri: string;
}

const PostImage: React.FC<PostImageProps> = ({ uri }) => {
  return <Image source={{ uri }} style={styles.image} />;
};

export default PostImage;
