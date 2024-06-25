import * as ImagePicker from "expo-image-picker";

export const pickImage = async (setProfilePic: (uri: string) => void) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    setProfilePic(result.assets[0].uri);
  }
};
