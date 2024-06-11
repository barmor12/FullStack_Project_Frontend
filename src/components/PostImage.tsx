import React from "react";
import { Image, StyleSheet } from "react-native";

interface PostImageProps {
  uri: string;
}

const PostImage: React.FC<PostImageProps> = ({ uri }) => {
  return <Image source={{ uri }} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default PostImage;
