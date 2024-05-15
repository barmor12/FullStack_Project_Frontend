import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserProfile = () => {
  const [user, setUser] = useState({ email: "", name: "", profilePic: "" });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://<your-server-ip>:3000/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.put("http://<your-server-ip>:3000/user/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (err: unknown) {
      if (typeof err === "string") {
        console.error(err);
      } else if (err instanceof Error) {
        alert("Failed to update profile: " + err.message);
      } else {
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
      />
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
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
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default UserProfile;
