import React from "react";
import { Modal, View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../styles/ModalOptionsStyles";

type ModalOptionsProps = {
  visible: boolean;
  closeOptionsModal: () => void;
  handleEditPost: () => void;
  handleDeletePost: () => void;
};

const ModalOptions: React.FC<ModalOptionsProps> = ({
  visible,
  closeOptionsModal,
  handleEditPost,
  handleDeletePost,
}) => {
  const confirmDelete = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: handleDeletePost,
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={closeOptionsModal}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={closeOptionsModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeOptionsModal}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleEditPost}
          >
            <Text style={styles.optionText}>Edit Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={confirmDelete}>
            <Text style={styles.optionText}>Delete Post</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalOptions;
