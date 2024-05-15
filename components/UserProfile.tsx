import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import {
  getAccessToken,
  getUserProfile,
  updateUserProfile,
} from "../authService";

const UserProfile = () => {
  const [name, setName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Token is null");
        const userProfile = await getUserProfile(token);
        setName(userProfile.name);
        setProfilePic(userProfile.profilePic);
        setEmail(userProfile.email);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          Alert.alert("Error", err.message);
        } else {
          setError("An unknown error occurred");
          Alert.alert("Error", "An unknown error occurred");
        }
      }
    };
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Token is null");
      await updateUserProfile(token, { name, profilePic, email });
      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        Alert.alert("Error", err.message);
      } else {
        setError("An unknown error occurred");
        Alert.alert("Error", "An unknown error occurred");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: profilePic }} style={styles.profilePic} />
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        disabled
      />
      <Button mode="contained" onPress={handleUpdateProfile}>
        Update Profile
      </Button>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default UserProfile;
