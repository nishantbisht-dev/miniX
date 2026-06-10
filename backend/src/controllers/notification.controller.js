const Notification = require("../models/Notification");

function formatNotification(notification) {
  const sender = notification.sender;
  return {
    id: notification._id.toString(), receiverId: notification.receiver.toString(),
    senderId: sender?._id?.toString() || "", senderName: sender?.name || "Unknown User",
    senderUsername: sender?.username || "unknown", type: notification.type,
    postId: notification.post ? notification.post.toString() : "", text: notification.text,
    read: notification.read, createdAt: notification.createdAt,
  };
}

async function getNotifications(req, res, next) {
  try {
    if (!req.user) { res.status(404); throw new Error("User profile not found. Please sync user first."); }
    const notifications = await Notification.find({ receiver: req.user._id }).populate("sender", "name username avatar").sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, notifications: notifications.map(formatNotification) });
  } catch (error) { next(error); }
}

async function markNotificationAsRead(req, res, next) {
  try {
    const notification = await Notification.findOne({ _id: req.params.notificationId, receiver: req.user._id });
    if (!notification) { res.status(404); throw new Error("Notification not found"); }
    notification.read = true;
    await notification.save();
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) { next(error); }
}

async function markAllNotificationsAsRead(req, res, next) {
  try {
    await Notification.updateMany({ receiver: req.user._id, read: false }, { read: true });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) { next(error); }
}

module.exports = { getNotifications, markNotificationAsRead, markAllNotificationsAsRead };
