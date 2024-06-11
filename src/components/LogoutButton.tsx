import React from "react";
import { Button } from "react-native-paper";
import styles from "../styles/styles";

interface LogoutButtonProps {
  handleLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ handleLogout }) => {
  return (
    <Button mode="contained" onPress={handleLogout} style={styles.button}>
      Logout
    </Button>
  );
};

export default LogoutButton;
