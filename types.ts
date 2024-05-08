// types.ts

import { ParamListBase, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define your screen names here
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Feed: undefined;
  UserProfile: undefined;
};

// Define navigation prop types for each screen
export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

export type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

export type FeedScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Feed"
>;

export type UserProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserProfile"
>;

// Define route prop type
export type RouteProps<T extends keyof RootStackParamList> = {
  route: RouteProp<RootStackParamList, T>;
};
