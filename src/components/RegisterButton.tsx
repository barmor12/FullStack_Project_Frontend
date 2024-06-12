import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";

interface RegisterButtonProps {
  onPress: () => void;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ onPress }) => {
  return (
    <Button mode="text" onPress={onPress} style={styles.button}>
      Don't have an account? Sign Up
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
});

export default RegisterButton;
