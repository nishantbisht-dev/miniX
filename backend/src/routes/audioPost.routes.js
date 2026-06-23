const express = require("express");
const { createAudioPost } = require("../controllers/audioPost.controller");
const { protect } = require("../middleware/auth.middleware");
const { audioUpload } = require("../middleware/upload.middleware");
const { checkTweetLimit } = require("../middleware/tweetLimit.middleware");

const router = express.Router();

router.post(
  "/",
  protect,
  checkTweetLimit,
  audioUpload.single("audio"),
  createAudioPost
);

module.exports = router;