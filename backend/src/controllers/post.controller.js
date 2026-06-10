const mongoose = require("mongoose");
const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Bookmark = require("../models/Bookmark");
const Notification = require("../models/Notification");
const createNotification = require("../utils/createNotification");

function formatPost(post) {
  const author = post.user;
  return {
    id: post._id.toString(),
    userId: author?._id?.toString() || post.user?.toString(),
    firebaseUid: post.firebaseUid,
    text: post.text,
    imageURL: post.imageURL || "",
    authorName: author?.name || "Unknown User",
    authorUsername: author?.username || "unknown",
    authorPhotoURL: author?.avatar || "",
    likesCount: post.likesCount || 0,
    commentsCount: post.commentsCount || 0,
    repostsCount: post.repostsCount || 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function formatComment(comment) {
  const author = comment.user;
  return {
    id: comment._id.toString(),
    postId: comment.post.toString(),
    userId: author?._id?.toString() || comment.user?.toString(),
    firebaseUid: comment.firebaseUid,
    text: comment.text,
    authorName: author?.name || "Unknown User",
    authorUsername: author?.username || "unknown",
    authorPhotoURL: author?.avatar || "",
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

async function createPost(req, res, next) {
  try {
    if (!req.user) throw Object.assign(new Error("User profile not found. Please sync user first."), { statusCode: 404 });
    const { text, imageURL } = req.body;
    if (!text || !text.trim()) {
      res.status(400);
      throw new Error("Post text is required");
    }
    const post = await Post.create({ user: req.user._id, firebaseUid: req.firebaseUser.uid, text: text.trim(), imageURL: imageURL || "" });
    await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });
    const populatedPost = await Post.findById(post._id).populate("user", "name username avatar firebaseUid");
    res.status(201).json({ success: true, message: "Post created", post: formatPost(populatedPost) });
  } catch (error) { next(error); }
}

async function getFeedPosts(req, res, next) {
  try {
    const posts = await Post.find().populate("user", "name username avatar firebaseUid").sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, posts: posts.map(formatPost) });
  } catch (error) { next(error); }
}

async function getPostById(req, res, next) {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) { res.status(400); throw new Error("Invalid post id"); }
    const post = await Post.findById(postId).populate("user", "name username avatar firebaseUid");
    if (!post) { res.status(404); throw new Error("Post not found"); }
    res.status(200).json({ success: true, post: formatPost(post) });
  } catch (error) { next(error); }
}

async function getUserPosts(req, res, next) {
  try {
    const posts = await Post.find({ user: req.params.userId }).populate("user", "name username avatar firebaseUid").sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts: posts.map(formatPost) });
  } catch (error) { next(error); }
}

async function deletePost(req, res, next) {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) { res.status(404); throw new Error("Post not found"); }
    if (post.firebaseUid !== req.firebaseUser.uid) { res.status(403); throw new Error("You can only delete your own post"); }
    await Post.findByIdAndDelete(postId);
    await Like.deleteMany({ post: postId });
    await Comment.deleteMany({ post: postId });
    await Bookmark.deleteMany({ post: postId });
    await Notification.deleteMany({ post: postId });
    await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: -1 } });
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) { next(error); }
}

async function toggleLike(req, res, next) {
  try {
    if (!req.user) { res.status(404); throw new Error("User profile not found. Please sync user first."); }
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) { res.status(404); throw new Error("Post not found"); }
    const existing = await Like.findOne({ post: postId, user: req.user._id });
    if (existing) {
      await Like.findByIdAndDelete(existing._id);
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      return res.status(200).json({ success: true, message: "Post unliked", liked: false });
    }
    await Like.create({ post: postId, user: req.user._id, firebaseUid: req.firebaseUser.uid });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
    await createNotification({ receiver: post.user, sender: req.user._id, type: "like", post: post._id, text: "liked your post" });
    res.status(200).json({ success: true, message: "Post liked", liked: true });
  } catch (error) { next(error); }
}

async function getLikeStatus(req, res, next) {
  try {
    const like = await Like.findOne({ post: req.params.postId, user: req.user._id });
    res.status(200).json({ success: true, liked: Boolean(like) });
  } catch (error) { next(error); }
}

async function createComment(req, res, next) {
  try {
    if (!req.user) { res.status(404); throw new Error("User profile not found. Please sync user first."); }
    const { postId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) { res.status(400); throw new Error("Comment text is required"); }
    const post = await Post.findById(postId);
    if (!post) { res.status(404); throw new Error("Post not found"); }
    const comment = await Comment.create({ post: postId, user: req.user._id, firebaseUid: req.firebaseUser.uid, text: text.trim() });
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
    await createNotification({ receiver: post.user, sender: req.user._id, type: "comment", post: post._id, text: "commented on your post" });
    const populated = await Comment.findById(comment._id).populate("user", "name username avatar firebaseUid");
    res.status(201).json({ success: true, message: "Comment added", comment: formatComment(populated) });
  } catch (error) { next(error); }
}

async function getPostComments(req, res, next) {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate("user", "name username avatar firebaseUid").sort({ createdAt: 1 });
    res.status(200).json({ success: true, comments: comments.map(formatComment) });
  } catch (error) { next(error); }
}

module.exports = { createPost, getFeedPosts, getPostById, getUserPosts, deletePost, toggleLike, getLikeStatus, createComment, getPostComments };
