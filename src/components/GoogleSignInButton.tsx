import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface Props {
  onPress: () => void;
}

const GoogleSignInButton: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name="google" size={20} color="#FFFFFF" />
      <Text style={styles.buttonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4285F4",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default GoogleSignInButton;
