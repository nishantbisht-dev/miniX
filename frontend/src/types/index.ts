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

  preferredLanguage?: "en" | "es" | "hi" | "pt" | "zh" | "fr";

  phone?: string;

  plan?: "free" | "bronze" | "silver" | "gold";
  subscriptionExpiresAt?: string | null;

  followersCount: number;
  followingCount: number;
  postsCount: number;

  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Post = {
  id: string;
  userId: string;
  firebaseUid: string;

  text: string;
  imageURL?: string;

  type: "text" | "audio";
  audioUrl?: string;
  audioDuration?: number;
  audioSize?: number;

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

export type LoginHistoryItem = {
  _id: string;
  browser: string;
  os: string;
  device: "desktop" | "mobile" | "tablet" | "unknown";
  ipAddress: string;
  status: "success" | "blocked";
  reason?: string;
  createdAt: string;
};

export type SubscriptionPlan = "free" | "bronze" | "silver" | "gold";

export type LanguageCode = "en" | "es" | "hi" | "pt" | "zh" | "fr";