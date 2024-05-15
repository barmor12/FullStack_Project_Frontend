import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Card, Title, Paragraph } from "react-native-paper";

interface Props {
  navigation: any; // Assuming your navigation prop type is set up elsewhere
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome to Bar Mor App</Title>
          <Paragraph style={styles.paragraph}>
            Discover, connect, and share moments and memories.
          </Paragraph>
        </Card.Content>
      </Card>
      <Button
        icon="login"
        mode="contained"
        onPress={() => navigation.navigate("Login")}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Log In
      </Button>
      <Button
        icon="account-plus"
        mode="contained"
        onPress={() => navigation.navigate("Register")}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Register
      </Button>
      <Button
        icon="account-circle"
        mode="contained"
        onPress={() => navigation.navigate("UserProfile")}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        User Profile
      </Button>
      <Button
        icon="rss"
        mode="contained"
        onPress={() => navigation.navigate("Feed")}
        style={styles.button}
        labelStyle={styles.buttonLabel}
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
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ee", // Example of a theme color
  },
  paragraph: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    width: "90%",
    paddingVertical: 8,
    marginVertical: 10,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default WelcomeScreen;
