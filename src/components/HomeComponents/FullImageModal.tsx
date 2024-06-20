import React from "react";
import { View, Image, TouchableOpacity, Modal, Text } from "react-native";
import styles from "../../styles/HomeStyles";

interface FullImageModalProps {
  modalVisible: boolean;
  fullImageUri: string;
  setModalVisible: (visible: boolean) => void;
}

const FullImageModal: React.FC<FullImageModalProps> = ({
  modalVisible,
  fullImageUri,
  setModalVisible,
}) => {
  if (!fullImageUri) {
    return null;
  }

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Image source={{ uri: fullImageUri }} style={styles.fullImage} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default FullImageModal;
