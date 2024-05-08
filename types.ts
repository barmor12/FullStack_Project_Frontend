// types.ts
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

// זהו הגדרת כל המסכים שלך והפרמטרים שהם עשויים לקבל בניווט
export type RootStackParamList = {
  Login: undefined; // לא מקבל פרמטרים
  Register: undefined; // לא מקבל פרמטרים
  Profile: undefined; // לא מקבל פרמטרים
  Feed: undefined; // לא מקבל פרמטרים
  Post: { postId: string }; // דוגמה למסך שמקבל פרמטר, כמו ID של פוסט
  EditProfile: undefined; // לא מקבל פרמטרים
};

// דוגמה להגדרת טיפוסים לפרופילים של ניווט בין מסכים
export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

export type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

export type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;

export type FeedScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Feed"
>;

export type PostScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Post"
>;

export type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditProfile"
>;

// דוגמה להגדרת טיפוסים למסלולי נתיב של הניווט
export type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

export type PostScreenRouteProp = RouteProp<RootStackParamList, "Post">;
