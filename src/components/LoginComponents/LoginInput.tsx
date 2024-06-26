import React from "react";
import { TextInput } from "react-native-paper";
import { StyleSheet, ViewStyle } from "react-native";

interface LoginInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: ViewStyle; // הוספנו את הפרופס style
}

const LoginInput: React.FC<LoginInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      secureTextEntry={secureTextEntry}
      style={[styles.input, style]}
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
