import React from "react";
import { View, Text, TextInput } from "react-native";
import { User } from "../../Types/types";
import styles from "../../styles/UserProfileStyles";

interface UserProfileDetailsProps {
  user: User;
  isEditing: boolean;
  newNickname: string;
  setNewNickname: (nickname: string) => void;
}

const UserProfileDetails: React.FC<UserProfileDetailsProps> = ({
  user,
  isEditing,
  newNickname,
  setNewNickname,
}) => {
  return (
    <View style={styles.details}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>
      <Text style={styles.label}>Nickname:</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={newNickname}
          onChangeText={setNewNickname}
        />
      ) : (
        <Text style={styles.value}>{user.nickname}</Text>
      )}
    </View>
  );
};

export default UserProfileDetails;
