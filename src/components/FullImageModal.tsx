import React from "react";
import {
  View,
  Image,
  Modal,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import styles from "../styles/HomeStyles";

type FullImageModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  fullImageUri: string;
};

const FullImageModal: React.FC<FullImageModalProps> = ({
  modalVisible,
  setModalVisible,
  fullImageUri,
}) => {
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
