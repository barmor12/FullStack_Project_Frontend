import * as React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { PostDetailsRouteProp } from "../types"; // ייבוא סוג PostDetailsRouteProp

type Props = {
  route: PostDetailsRouteProp;
};

const PostDetails = ({ route }: Props) => {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: post.sender.profilePic }}
        style={styles.profilePic}
      />
      <Text style={styles.name}>{post.sender.name}</Text>
      <Text style={styles.message}>{post.message}</Text>
      {/* ניתן להוסיף פרטים נוספים על הפוסט כאן */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
  },
});

export default PostDetails;
