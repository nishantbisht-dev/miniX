const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", required: true
    },

    firebaseUid: {
      type: String,
      required: true,
      index: true
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280
    },

    imageURL: {
      type: String,
      default: ""
    },

    likesCount: {
      type: Number,
      default: 0
    },

    commentsCount: {
      type: Number,
      default: 0
    },

    repostsCount: {
      type: Number,
      default: 0
    },

    type: {
      type: String,
      enum: ["text", "audio"],
      default: "text",
    },

    audioUrl: {
      type: String,
      default: "",
    },

    audioDuration: {
      type: Number,
      default: 0,
    },

    audioSize: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
