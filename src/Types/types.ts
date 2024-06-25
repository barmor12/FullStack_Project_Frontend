import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  CreatePost: {
    postId?: string;
    isEdit?: boolean;
    onPostCreated?: (newPost: Post) => void;
  };
  PostDetails: { postId: string };
  Posts: undefined;
  UserProfile: undefined;
  Main: undefined;
  CreatePostScreen: {
    postId?: string;
    isEdit?: boolean;
  };
  UserProfileScreen: undefined;
  HomeScreen: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

export type UserProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserProfile"
>;

export type CreatePostScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreatePostScreen"
>;

export type CreatePostScreenRouteProp = RouteProp<
  RootStackParamList,
  "CreatePostScreen"
>;

export interface Post {
  _id: string;
  message: string;
  sender: {
    _id: string;
    nickname: string;
    name: string;
    profilePic: string;
  };
  image?: string;
  createdAt: string;
}

export interface User {
  _id: string;
  nickname: string;
  name: string;
  email: string;
  profilePic: string;
}
