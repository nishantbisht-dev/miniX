import { Comment, Notification, Post, UserProfile } from "@/types";

export function mapUser(user: any): UserProfile {
  return {
    uid: user._id,
    firebaseUid: user.firebaseUid,
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio || "",
    photoURL: user.avatar || "",
    coverURL: user.coverImage || "",
    browserNotificationsEnabled: user.browserNotificationsEnabled !== undefined
      ? user.browserNotificationsEnabled
      : true,
    preferredLanguage: user.preferredLanguage || "en",
    phone: user.phone || "",
    plan: user.plan || "free",
    subscriptionExpiresAt: user.subscriptionExpiresAt || null,
    followersCount: user.followersCount || 0, followingCount: user.followingCount || 0, postsCount: user.postsCount || 0,
    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(), updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),

  };
}

export function mapPost(post: any): Post {
  return {
    type: post.type || "text",
    audioUrl: post.audioUrl || "",
    audioDuration: post.audioDuration || 0,
    audioSize: post.audioSize || 0,
    id: post.id, userId: post.userId, firebaseUid: post.firebaseUid, text: post.text, imageURL: post.imageURL || "",
    authorName: post.authorName, authorUsername: post.authorUsername, authorPhotoURL: post.authorPhotoURL || "",
    likesCount: post.likesCount || 0, commentsCount: post.commentsCount || 0, repostsCount: post.repostsCount || 0,
    createdAt: post.createdAt ? new Date(post.createdAt) : null, updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
  };
}

export function mapComment(comment: any): Comment {
  return {
    id: comment.id, postId: comment.postId, userId: comment.userId, firebaseUid: comment.firebaseUid,
    text: comment.text, authorName: comment.authorName, authorUsername: comment.authorUsername, authorPhotoURL: comment.authorPhotoURL || "",
    createdAt: comment.createdAt ? new Date(comment.createdAt) : null, updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : null,
  };
}

export function mapNotification(notification: any): Notification {
  return {
    id: notification.id, receiverId: notification.receiverId, senderId: notification.senderId,
    senderName: notification.senderName, senderUsername: notification.senderUsername,
    type: notification.type, postId: notification.postId || "", text: notification.text, read: notification.read || false,
    createdAt: notification.createdAt ? new Date(notification.createdAt) : null,
  };
}
