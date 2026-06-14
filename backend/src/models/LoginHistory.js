const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    browser: {
      type: String,
      default: "Unknown",
    },

    os: {
      type: String,
      default: "Unknown",
    },

    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },

    ipAddress: {
      type: String,
      default: "Unknown",
    },

    status: {
      type: String,
      enum: ["success", "blocked"],
      default: "success",
    },

    reason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);

module.exports = LoginHistory;