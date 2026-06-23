const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },

    email: { type: String, required: true, lowercase: true, trim: true },
    bio: { type: String, default: "", maxlength: 160 },
    avatar: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    browserNotificationsEnabled: {
      type: Boolean,
      default: true,
    },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },

    preferredLanguage: {
      type: String,
      enum: ["en", "es", "hi", "pt", "zh", "fr"],
      default: "en",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    plan: {
      type: String,
      enum: ["free", "bronze", "silver", "gold"],
      default: "free",
    },

    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
