const express = require("express");
const { toggleFollow, getFollowStatus, toggleBookmark, getBookmarkStatus, getBookmarkedPosts } = require("../controllers/social.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.use(protect);
router.post("/follow/:targetUserId", toggleFollow);
router.get("/follow/:targetUserId/status", getFollowStatus);
router.get("/bookmarks", getBookmarkedPosts);
router.post("/bookmarks/:postId", toggleBookmark);
router.get("/bookmarks/:postId/status", getBookmarkStatus);

module.exports = router;
