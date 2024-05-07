import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";

export default function App() {
  console.log("App is called");
  const [title, setTitle] = useState("Hello World");

  let name = "Bar Mor App";
  const onImageClick = () => {
    console.log("Image Clicked");
    setTitle("Image Clicked");
  };

  const onPressLearnMore = () => {
    console.log("Learn More Clicked");
    setTitle("Learn More Clicked");
    Alert.alert("Hey", "Are You Sure?", [
      { text: "Yes", onPress: () => console.log("Yes Pressed") },
      { text: "No", onPress: () => console.log("No Pressed") },
    ]);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onImageClick}>
        <Image style={styles.image} source={require("./assets/avatar.avif")} />
      </TouchableOpacity>
      <Text style={styles.text1}>{name} </Text>
      <Text style={styles.text}>State: {title} </Text>

      <Button onPress={onPressLearnMore} title="Learn More" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
  text1: {
    fontSize: 50,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});
