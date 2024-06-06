import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import axios from "axios";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Login from "./components/Login";
import Home from "./components/Home";
import Posts from "./components/Posts";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import CreatePost from "./components/CreatePost";
import PostDetails from "./components/PostDetails";
import { getAccessToken, refreshAccessToken, clearTokens } from "./authService";
import { RootStackParamList } from "./types";

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
      options={{ title: "Posts", headerShown: false }}
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
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        let token = await getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await refreshAccessToken();
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (err) {
            clearTokens();
            // handle error gracefully
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
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
