import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/HomeStyles";
import { HomeScreenNavigationProp } from "../../Types/types";

const NewPostButton = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleNavigateToCreatePost = () => {
    navigation.navigate({
      name: "CreatePost",
      params: {},
    });
  };

  return (
    <View style={styles.newPostContainer}>
      <TouchableOpacity
        style={styles.newPostButton}
        onPress={handleNavigateToCreatePost}
      >
        <AntDesign name="pluscircleo" size={24} color="white" />
        <Text style={styles.buttonText}>Create a New Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewPostButton;
