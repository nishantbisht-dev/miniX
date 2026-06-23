const mongoose = require("mongoose");

/*
  PasswordResetRequest stores password reset usage.

  Requirement:
  User can use forgot password only one time per day.

  We store:
  - email or phone
  - firebaseUid
  - requestedAt
*/

const passwordResetRequestSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PasswordResetRequest = mongoose.model(
  "PasswordResetRequest",
  passwordResetRequestSchema
);

module.exports = PasswordResetRequest;