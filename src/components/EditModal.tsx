// components/EditModal.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import styles from "../styles/PostDetailsStyles";

const EditModal = ({
  visible,
  onClose,
  onUpdate,
  postMessage,
  postImage,
}: {
  visible: boolean;
  onClose: () => void;
  onUpdate: (message: string, image: string | null) => void;
  postMessage: string;
  postImage: string | null;
}) => {
  const [editedMessage, setEditedMessage] = useState(postMessage);
  const [selectedImage, setSelectedImage] = useState<string | null>(postImage);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.editModalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Edit your post message"
          value={editedMessage}
          onChangeText={setEditedMessage}
        />
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        )}
        <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
          <Text style={styles.pickImageButtonText}>
            Pick an image from gallery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => onUpdate(editedMessage, selectedImage)}
        >
          <Text style={styles.updateButtonText}>Update Post</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default EditModal;
