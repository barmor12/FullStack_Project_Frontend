import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Card, Title } from "react-native-paper";
import { FeedScreenNavigationProp } from "../types"; // Import the correct navigation prop type

interface Props {
  navigation: FeedScreenNavigationProp; // Use the correct navigation prop type
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Bar Mor App</Title>
        </Card.Content>
      </Card>
      <Button
        icon="login"
        mode="contained"
        onPress={() => navigation.navigate("Login")}
        style={styles.button}
      >
        Log In
      </Button>
      <Button
        icon="account-plus"
        mode="contained"
        onPress={() => navigation.navigate("Register")}
        style={styles.button}
      >
        Register
      </Button>
      <Button
        icon="account-circle"
        mode="contained"
        onPress={() => navigation.navigate("UserProfile")}
        style={styles.button}
      >
        User Profile
      </Button>
      <Button
        icon="rss"
        mode="contained"
        onPress={() => navigation.navigate("Feed")}
        style={styles.button}
      >
        View Feed
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    marginBottom: 20,
    padding: 10,
  },
  button: {
    width: "90%",
    paddingVertical: 8,
    marginVertical: 10,
  },
});

export default WelcomeScreen;
