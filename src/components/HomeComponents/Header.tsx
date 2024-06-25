import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationProp, User } from "../../Types/types";
import styles from "../../styles/HomeStyles";
import config from "../../Config/config";

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleNavigateToUserProfile = () => {
    navigation.navigate("UserProfileScreen"); // ודא שזה תואם את השם של המסך בניווט שלך
  };

  return (
    <View style={styles.headerContainer}>
      {user && (
        <View style={styles.userContainer}>
          <TouchableOpacity
            style={styles.profileIconContainer}
            onPress={handleNavigateToUserProfile}
          >
            <Text style={styles.profileText}>{user.nickname}</Text>
            <Image
              source={{ uri: `${config.serverUrl}${user.profilePic}` }}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.textContainer}>
        <Image
          source={require("../../assets/logo.png")} // ודא שהנתיב נכון
          style={styles.logo}
        />
        <Text style={styles.headerText}>Welcome to Bar Mor's App!</Text>
        <Text style={styles.headerSubText}>
          This app is about posting and viewing posts from other users.
        </Text>
      </View>
    </View>
  );
};

export default Header;
