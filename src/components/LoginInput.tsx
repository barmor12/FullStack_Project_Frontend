import React from "react";
import { TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";

interface LoginInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const LoginInput: React.FC<LoginInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      secureTextEntry={secureTextEntry}
      style={styles.input}
      autoCapitalize="none"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
});

export default LoginInput;
