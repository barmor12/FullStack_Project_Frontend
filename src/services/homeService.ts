import { fetchWithAuth } from "./authService";
import config from "../Config/config";
import { Post, User } from "../Types/types";

export const fetchUserData = async (): Promise<User> => {
  const response = await fetchWithAuth(`${config.serverUrl}/auth/user`);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch user data: ${response.statusText}`);
  }
  return response.data;
};

export const fetchPostsData = async (): Promise<Post[]> => {
  const response = await fetchWithAuth(`${config.serverUrl}/post`);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch posts data: ${response.statusText}`);
  }
  return response.data;
};

export const deletePost = async (postId: string): Promise<boolean> => {
  const response = await fetchWithAuth(`${config.serverUrl}/post/${postId}`, {
    method: "DELETE",
  });
  return response.status === 200;
};
