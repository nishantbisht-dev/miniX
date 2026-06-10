const express = require("express");
const { syncCurrentUser, getCurrentUser, updateCurrentUser, getUserByUsername, searchUsers } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/sync", protect, syncCurrentUser);
router.get("/me", protect, getCurrentUser);
router.patch("/me", protect, updateCurrentUser);
router.get("/search", protect, searchUsers);
router.get("/:username", protect, getUserByUsername);

module.exports = router;
