import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
      <Button title="Go to Posts" onPress={handleNavigateToPosts} />
      <Button
        title="Go to User Profile"
        onPress={handleNavigateToUserProfile}
      />
      <Button title="Create a Post" onPress={handleNavigateToCreatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
