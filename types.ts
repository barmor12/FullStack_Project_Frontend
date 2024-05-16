import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  CreatePost: undefined;
  PostDetails: { postId: string }; // ודא שה-postId כלול כאן
  Posts: undefined;
  UserProfile: undefined;
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
