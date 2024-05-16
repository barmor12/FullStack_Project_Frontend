import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { getAccessToken } from "../authService";
import config from "../config";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      setError("");
      try {
        const token = await getAccessToken();
        const response = await fetch(`${config.serverUrl}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        if (response.status === 200) {
          setUser(json);
        } else {
          setError(json.error || "Failed to fetch user profile!");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Network error or server is down");
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {user.profilePic && (
            <Image
              source={{ uri: user.profilePic }}
              style={styles.profilePic}
            />
          )}
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name}</Text>
        </>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
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
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default UserProfile;
