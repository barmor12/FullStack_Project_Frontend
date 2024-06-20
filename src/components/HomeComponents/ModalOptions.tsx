import React from "react";
import { Modal, View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../../styles/ModalOptionsStyles";

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
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleDeletePost}
          >
            <Text style={styles.optionText}>Delete Post</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalOptions;
