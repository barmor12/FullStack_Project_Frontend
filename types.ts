import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Feed: undefined;
  UserProfile: undefined;
  Posts: undefined;
  UserPosts: undefined;
  EditPost: { postId: string };
  DeletePost: { postId: string };
  CreatePost: undefined;
};

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
export type PostsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Posts"
>;
export type UserPostsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserPosts"
>;
export type EditPostScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditPost"
>;
export type DeletePostScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DeletePost"
>;
export type CreatePostScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreatePost"
>;
