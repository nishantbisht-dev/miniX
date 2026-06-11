export type UserProfile = {
  uid: string;
  firebaseUid: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  photoURL: string;
  coverURL: string;
  browserNotificationsEnabled: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Post = {
  id: string;
  userId: string;
  firebaseUid: string;
  text: string;
  imageURL?: string;
  authorName: string;
  authorUsername: string;
  authorPhotoURL: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  firebaseUid: string;
  text: string;
  authorName: string;
  authorUsername: string;
  authorPhotoURL: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Notification = {
  id: string;
  receiverId: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  type: "like" | "comment" | "follow";
  postId?: string;
  text: string;
  read: boolean;
  createdAt: Date | null;
};
