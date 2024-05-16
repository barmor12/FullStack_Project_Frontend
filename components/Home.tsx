import React from "react";
import { View, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons"; // Import AntDesign icons
import { HomeScreenNavigationProp } from "../types";

const Home = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleNavigateToPosts = () => {
    navigation.navigate("Posts");
  };

  const handleNavigateToUserProfile = () => {
    navigation.navigate("UserProfile");
  };

  const handleNavigateToCreatePost = () => {
    navigation.navigate("CreatePost");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateToUserProfile}>
        <AntDesign
          name="user"
          size={24}
          color="black"
          style={styles.profileIcon}
        />
      </TouchableOpacity>
      <Button title="All Posts" onPress={handleNavigateToPosts} />
      <Button
        title="Create a New Post Post"
        onPress={handleNavigateToCreatePost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    position: "absolute",
    top: 10,
    left: 10,
  },
});

export default Home;
