import { StackNavigationProp } from "@react-navigation/stack";

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

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
export type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

export type PostsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Posts"
>;

export type CreatePostScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreatePost"
>;
export type PostDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PostDetails"
>;
export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;
export type UserProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserProfile"
>;

export interface Post {
  _id: string;
  message: string;
  sender: {
    _id: string;
    name: string;
    profilePic: string;
  };
  image?: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  profilePic: string;
  email: string;
}
