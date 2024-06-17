import config from "../Config/config";
import { fetchWithAuth } from "./authService";
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

export const fetchPostData = async (postId: string): Promise<Post> => {
  const response = await fetchWithAuth(`${config.serverUrl}/post/${postId}`);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch post data: ${response.statusText}`);
  }
  return response.data;
};

export const deletePost = async (postId: string): Promise<boolean> => {
  const response = await fetchWithAuth(`${config.serverUrl}/post/${postId}`, {
    method: "DELETE",
  });
  return response.status === 200;
};

export const handleUpdatePost = async (
  postId: string,
  message: string,
  imageUri: string | null
): Promise<boolean> => {
  const formData = new FormData();
  formData.append("message", message);
  if (imageUri) {
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);
  }

  const response = await fetchWithAuth(`${config.serverUrl}/post/${postId}`, {
    method: "PUT",
    body: formData,
  });

  if (response.status !== 200) {
    throw new Error("Failed to update post");
  }

  return true;
};

export const fetchUserPosts = async (
  setUser: (user: User | null) => void,
  setPosts: (posts: Post[]) => void,
  setError: (error: string) => void
) => {
  setError("");
  try {
    const user = await fetchUserData();
    const posts = await fetchPostsData();
    const userPosts = posts.filter((post) => post.sender._id === user._id);
    setUser(user);
    setPosts(userPosts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Network error or server is down");
    }
  }
};

export const fetchPosts = async (
  setUser: (user: User | null) => void,
  setPosts: (posts: Post[]) => void,
  setError: (error: string) => void
) => {
  setError("");
  try {
    const user = await fetchUserData();
    const posts = await fetchPostsData();
    setUser(user);
    setPosts(posts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Network error or server is down");
    }
  }
};

export const handleDeletePost = async (
  postId: string,
  setPosts: (postsUpdater: (posts: Post[]) => Post[]) => void,
  setError: (error: string) => void
) => {
  setError("");
  try {
    const success = await deletePost(postId);
    if (success) {
      setPosts((prevPosts: Post[]) =>
        prevPosts.filter((post) => post._id !== postId)
      );
    } else {
      setError("Failed to delete post");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Network error or server is down");
    }
  }
};
