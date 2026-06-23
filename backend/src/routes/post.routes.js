const express = require("express");
const { createPost, getFeedPosts, getPostById, getUserPosts, deletePost, toggleLike, getLikeStatus, createComment, getPostComments } = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();
const { checkTweetLimit } = require("../middleware/tweetLimit.middleware");


router.use(protect);
router.route("/").post(createPost).get(getFeedPosts);
router.post("/", protect, checkTweetLimit, createPost);
router.get("/user/:userId", getUserPosts);
router.route("/:postId").get(getPostById).delete(deletePost);
router.post("/:postId/like", toggleLike);
router.get("/:postId/like-status", getLikeStatus);
router.route("/:postId/comments").post(createComment).get(getPostComments);


module.exports = router;
