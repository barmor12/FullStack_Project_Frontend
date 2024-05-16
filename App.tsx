import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Posts" component={Posts} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="UserPosts" component={UserPosts} />
        <Stack.Screen name="PostDetails" component={PostDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
