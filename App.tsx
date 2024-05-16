import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Import AntDesign icons
import Login from "./components/Login";
import Home from "./components/Home";
import Posts from "./components/Posts";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import CreatePost from "./components/CreatePost";
import UserPosts from "./components/UserPosts";
import PostDetails from "./components/PostDetails";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0084ff",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Home",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => console.log("Navigate to UserProfile")}
              >
                <AntDesign
                  name="user"
                  size={24}
                  color="white"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Posts"
          component={Posts}
          options={{ title: "Posts" }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "Register" }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            title: "User Profile",
            headerLeft: () => (
              <TouchableOpacity onPress={() => console.log("Navigate to Home")}>
                <AntDesign
                  name="arrowleft"
                  size={24}
                  color="white"
                  style={{ marginLeft: 15 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{ title: "Create Post" }}
        />
        <Stack.Screen
          name="PostDetails"
          component={PostDetails}
          options={{ title: "Post Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default App;
