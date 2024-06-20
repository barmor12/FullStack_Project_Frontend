import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { HomeScreenNavigationProp, User } from "../../Types/types";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/HomeStyles";
import config from "../../Config/config";

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
      <Text style={styles.headerText}>Welcome to Bar Mor's App!</Text>
      <Text style={styles.headerSubText}>
        This app is about posting and viewing posts from other users.
      </Text>
      {user && (
        <View style={styles.userContainer}>
          <TouchableOpacity
            style={styles.profileIconContainer}
            onPress={handleNavigateToUserProfile}
          >
            <Image
              source={{ uri: `${config.serverUrl}${user.profilePic}` }}
              style={styles.profileIcon}
            />
            <Text style={styles.profileText}>Hello, {user.name}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;
