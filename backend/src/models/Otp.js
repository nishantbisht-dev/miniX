const mongoose = require("mongoose");

/*
  OTP model stores temporary one-time passwords.

  This model is reusable for different verification tasks:
  - audio upload
  - forgot password
  - language switch
  - chrome login

  We store:
  - user
  - email
  - phone
  - otp
  - purpose
  - expiresAt
  - verified
*/

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: [
        "audio_upload",
        "forgot_password",
        "language_switch",
        "chrome_login",
      ],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/*
  Automatically delete expired OTP documents from MongoDB.

  MongoDB TTL index:
  When expiresAt time passes, MongoDB can remove this document.
*/
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;