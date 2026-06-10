const Notification = require("../models/Notification");

async function createNotification({ receiver, sender, type, post = null, text }) {
  if (!receiver || !sender) return;
  if (receiver.toString() === sender.toString()) return;

  if (type === "like" || type === "follow") {
    const existing = await Notification.findOne({ receiver, sender, type, post: post || null });
    if (existing) return;
  }

  await Notification.create({ receiver, sender, type, post, text, read: false });
}

module.exports = createNotification;
