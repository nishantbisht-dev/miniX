const mongoose = require("mongoose");

/*
  LoginHistory stores every login/session record of a user.

  It helps users see:
  - which browser was used
  - which OS was used
  - which device was used
  - which IP address was used
  - when login happened
*/

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
  },
  {
    timestamps: true,
  }
);

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);

module.exports = LoginHistory;