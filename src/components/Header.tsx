import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { HomeScreenNavigationProp, User } from "../Types/types";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/HomeStyles";
import config from "../Config/config";

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleNavigateToUserProfile = () => {
    navigation.navigate("UserProfile");
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Welcome to the Home Page!</Text>
      <Text style={styles.headerSubText}>
        Here you can find all the latest posts from all users.
      </Text>
      {user && (
        <TouchableOpacity
          style={styles.profileIconContainer}
          onPress={handleNavigateToUserProfile}
        >
          <Image
            source={{ uri: `${config.serverUrl}${user.profilePic}` }}
            style={styles.profileIcon}
          />
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
