import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/ModalOptionsStyles";

type ModalOptionsProps = {
  visible: boolean;
  closeOptionsModal: () => void;
  onEditPress: () => void;
  onDeletePress: () => void;
};

const ModalOptions: React.FC<ModalOptionsProps> = ({
  visible,
  closeOptionsModal,
  onEditPress,
  onDeletePress,
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
          <TouchableOpacity style={styles.optionButton} onPress={onEditPress}>
            <Text style={styles.optionText}>Edit Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={onDeletePress}>
            <Text style={styles.optionText}>Delete Post</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalOptions;
