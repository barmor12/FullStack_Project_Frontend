import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Image } from "react-native";
import { TextInput, Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types"; // Define this type based on your navigation needs

type UserProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserProfile"
>;

interface Props {
  navigation: UserProfileScreenNavigationProp;
}

const UserProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    // Placeholder for fetching user data
    setUsername("JohnDoe");
    setEmail("john@example.com");
    setProfilePic("https://example.com/profile-pic.jpg");
  }, []);

  const handleUpdateProfile = async () => {
    // Placeholder for profile update logic
    console.log("Profile updated");
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: profilePic }} style={styles.profilePic} />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default UserProfileScreen;
