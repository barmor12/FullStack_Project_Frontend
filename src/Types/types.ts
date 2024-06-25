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
  CreatePostScreen: undefined;
  UserProfileScreen: undefined;
  HomeScreen: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

export type CreatePostScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreatePost"
>;

export type CreatePostScreenRouteProp = RouteProp<
  RootStackParamList,
  "CreatePost"
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
