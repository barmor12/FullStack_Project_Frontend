import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Feed: undefined;
  UserProfile: undefined;
  Posts: undefined;
  UserPosts: undefined;
  EditPost: { postId: string };
  DeletePost: { postId: string };
  CreatePost: undefined;
  PostDetails: { post: Post };
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
export type PostDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PostDetails"
>;
export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

// הגדרת וייצוא סוג הפוסט
export interface Post {
  _id: string; // שינוי ל _id כפי שהתקבל מהשרת
  message: string;
  sender: {
    name: string;
    profilePic: string;
  };
  createdAt: string;
}
