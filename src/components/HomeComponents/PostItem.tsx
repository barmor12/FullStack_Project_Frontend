import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import config from "../../Config/config";
import { Post, User } from "../../Types/types";
import styles from "../../styles/PostItemStyles";

type PostItemProps = {
  item: Post;
  user: User | null;
  handleNavigateToPostDetails: (postId: string) => void;
  handleEditPost: (postId: string) => void;
  handleDeletePost: (postId: string) => void;
  openFullImage: (uri: string) => void;
  openOptionsModal: (postId: string) => void;
};

const PostItem: React.FC<PostItemProps> = ({
  item,
  user,
  handleNavigateToPostDetails,
  handleEditPost,
  handleDeletePost,
  openFullImage,
  openOptionsModal,
}) => {
  return (
    <TouchableOpacity onPress={() => handleNavigateToPostDetails(item._id)}>
      <View style={styles.post}>
        <View style={styles.postHeader}>
          {item.sender && item.sender.profilePic ? (
            <Image
              source={{ uri: `${config.serverUrl}${item.sender.profilePic}` }}
              style={styles.profilePic}
            />
          ) : (
            <View style={styles.profilePicPlaceholder} />
          )}
          <View style={styles.postHeaderText}>
            {item.sender && (
              <Text style={styles.sender}>{item.sender.name}</Text>
            )}
            <Text style={styles.postDate}>
              {new Date(item.createdAt).toLocaleDateString()}{" "}
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>
          {user && item.sender && user._id === item.sender._id && (
            <TouchableOpacity onPress={() => openOptionsModal(item._id)}>
              <Entypo name="dots-three-horizontal" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.message}>{item.message}</Text>
        {item.image && (
          <TouchableOpacity
            onPress={() => openFullImage(`${config.serverUrl}${item.image}`)}
          >
            <Image
              source={{ uri: `${config.serverUrl}${item.image}` }}
              style={styles.postImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PostItem;
