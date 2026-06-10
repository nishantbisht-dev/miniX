const express = require("express");
const { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } = require("../controllers/notification.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.use(protect);
router.get("/", getNotifications);
router.patch("/read-all", markAllNotificationsAsRead);
router.patch("/:notificationId/read", markNotificationAsRead);

module.exports = router;
