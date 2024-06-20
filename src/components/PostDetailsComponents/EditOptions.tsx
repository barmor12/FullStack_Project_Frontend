import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "../../styles/PostDetailsStyles";

const EditOptions = ({
  onEditPress,
  onDeletePress,
}: {
  onEditPress: () => void;
  onDeletePress: () => void;
}) => {
  return (
    <View style={styles.editOptions}>
      <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Post</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDeletePress}>
        <Text style={styles.deleteButtonText}>Delete Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditOptions;
