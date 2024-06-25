import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Login from "./src/Pages/Login";
import Home from "./src/Pages/Home";
import Posts from "./src/Pages/Posts";
import Register from "./src/Pages/Register";
import UserProfile from "./src/Pages/UserProfile";
import CreatePost from "./src/Pages/CreatePost";
import PostDetails from "./src/Pages/PostDetails";
import { RootStackParamList } from "./src/Types/types";
import { getAccessToken, isTokenExpired } from "./src/services/authService";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={Home} />
    <Stack.Screen name="PostDetails" component={PostDetails} />
    <Stack.Screen name="CreatePost" component={CreatePost} />
  </Stack.Navigator>
);

const UserProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UserProfileScreen" component={UserProfile} />
  </Stack.Navigator>
);

const CreatePostStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CreatePostScreen" component={CreatePost} />
  </Stack.Navigator>
);

type TabBarIconProps = {
  route: { name: string };
  focused: boolean;
  color: string;
  size: number;
};

const AnimatedTabBarIcon: React.FC<TabBarIconProps> = ({
  route,
  focused,
  color,
  size,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(focused ? 1.2 : 1) }],
    };
  });

  let iconName = "";

  if (route.name === "HomeTab") {
    iconName = "home-outline";
  } else if (route.name === "Posts") {
    iconName = "list-outline";
  } else if (route.name === "CreatePostTab") {
    iconName = "add-circle-outline";
  } else if (route.name === "UserProfileTab") {
    iconName = "person-outline";
  }

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={iconName as any} size={size} color={color} />
    </Animated.View>
  );
};

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => (
        <AnimatedTabBarIcon
          route={route}
          focused={focused}
          color={color}
          size={size}
        />
      ),
      tabBarActiveTintColor: "#6200ee",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{ title: "Home", headerShown: false }}
    />
    <Tab.Screen
      name="Posts"
      component={Posts}
      options={{ title: "My Posts", headerShown: false }}
    />
    <Tab.Screen
      name="CreatePostTab"
      component={CreatePostStack}
      options={{ title: "Create Post", headerShown: false }}
    />
    <Tab.Screen
      name="UserProfileTab"
      component={UserProfileStack}
      options={{ title: "Profile", headerShown: false }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [initialRoute, setInitialRoute] = useState<"Login" | "Main">("Login");

  useEffect(() => {
    const checkToken = async () => {
      const token = await getAccessToken();
      if (token && !isTokenExpired(token)) {
        setInitialRoute("Main");
      } else {
        setInitialRoute("Login");
      }
    };

    checkToken();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: "Login", headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ title: "Register", headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
