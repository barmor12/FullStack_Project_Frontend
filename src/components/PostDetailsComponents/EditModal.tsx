import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: (message: string, image: string | null) => Promise<void>;
  postMessage: string;
  postImage: string | null;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onClose,
  onUpdate,
  postMessage,
  postImage,
}) => {
  const [editedMessage, setEditedMessage] = useState(postMessage);
  const [selectedImage, setSelectedImage] = useState<string | null>(postImage);

  useEffect(() => {
    setEditedMessage(postMessage);
    setSelectedImage(postImage);
  }, [postMessage, postImage]);

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

const styles = StyleSheet.create({
  editModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeButton: {
    alignSelf: "flex-end",
    margin: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
  input: {
    width: "80%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  pickImageButton: {
    marginVertical: 10,
  },
  pickImageButtonText: {
    color: "white",
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default EditModal;
