const mongoose = require("mongoose");
const Follow = require("../models/Follow");
const Bookmark = require("../models/Bookmark");
const User = require("../models/User");
const Post = require("../models/Post");
const createNotification = require("../utils/createNotification");

function formatBookmarkedPost(post) {
  const author = post.user;
  return {
    id: post._id.toString(), userId: author?._id?.toString(), firebaseUid: post.firebaseUid,
    text: post.text, imageURL: post.imageURL || "", authorName: author?.name || "Unknown User",
    authorUsername: author?.username || "unknown", authorPhotoURL: author?.avatar || "",
    likesCount: post.likesCount || 0, commentsCount: post.commentsCount || 0,
    repostsCount: post.repostsCount || 0, createdAt: post.createdAt, updatedAt: post.updatedAt,
  };
}

async function toggleFollow(req, res, next) {
  try {
    if (!req.user) { res.status(404); throw new Error("User profile not found. Please sync user first."); }
    const { targetUserId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) { res.status(400); throw new Error("Invalid target user id"); }
    if (req.user._id.toString() === targetUserId) { res.status(400); throw new Error("You cannot follow yourself"); }
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) { res.status(404); throw new Error("Target user not found"); }
    const existing = await Follow.findOne({ follower: req.user._id, following: targetUserId });
    if (existing) {
      await Follow.findByIdAndDelete(existing._id);
      await User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: -1 } });
      await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } });
      return res.status(200).json({ success: true, message: "User unfollowed", following: false });
    }
    await Follow.create({ follower: req.user._id, following: targetUserId });
    await User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: 1 } });
    await createNotification({ receiver: targetUserId, sender: req.user._id, type: "follow", text: "started following you" });
    res.status(200).json({ success: true, message: "User followed", following: true });
  } catch (error) { next(error); }
}

async function getFollowStatus(req, res, next) {
  try {
    if (!req.user) { res.status(404); throw new Error("User profile not found. Please sync user first."); }
    const existing = await Follow.findOne({ follower: req.user._id, following: req.params.targetUserId });
    res.status(200).json({ success: true, following: Boolean(existing) });
  } catch (error) { next(error); }
}

async function toggleBookmark(req, res, next) {
  try {
    if (!req.user) { res.status(404); throw new Error("User profile not found. Please sync user first."); }
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) { res.status(404); throw new Error("Post not found"); }
    const existing = await Bookmark.findOne({ user: req.user._id, post: postId });
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.status(200).json({ success: true, message: "Bookmark removed", bookmarked: false });
    }
    await Bookmark.create({ user: req.user._id, post: postId });
    res.status(200).json({ success: true, message: "Post bookmarked", bookmarked: true });
  } catch (error) { next(error); }
}

async function getBookmarkStatus(req, res, next) {
  try {
    if (!req.user) { res.status(404); throw new Error("User profile not found. Please sync user first."); }
    const existing = await Bookmark.findOne({ user: req.user._id, post: req.params.postId });
    res.status(200).json({ success: true, bookmarked: Boolean(existing) });
  } catch (error) { next(error); }
}

async function getBookmarkedPosts(req, res, next) {
  try {
    if (!req.user) { res.status(404); throw new Error("User profile not found. Please sync user first."); }
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate({ path: "post", populate: { path: "user", select: "name username avatar firebaseUid" } }).sort({ createdAt: -1 });
    const posts = bookmarks.filter((b) => b.post).map((b) => formatBookmarkedPost(b.post));
    res.status(200).json({ success: true, posts });
  } catch (error) { next(error); }
}

module.exports = { toggleFollow, getFollowStatus, toggleBookmark, getBookmarkStatus, getBookmarkedPosts };
