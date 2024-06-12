import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";

interface GoogleSignInButtonProps {
  onPress: () => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onPress }) => {
  return (
    <Button mode="contained" onPress={onPress} style={styles.button}>
      Sign in with Google
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
});

export default GoogleSignInButton;
