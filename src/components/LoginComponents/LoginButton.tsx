import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";

interface LoginButtonProps {
  onPress: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onPress }) => {
  return (
    <Button mode="contained" onPress={onPress} style={styles.button}>
      Log In
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
});

export default LoginButton;
