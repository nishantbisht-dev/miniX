const cloudinary = require("../config/cloudinary");
const Otp = require("../models/Otp");
const Post = require("../models/Post");

/*
  Check if current IST time is between 2 PM and 7 PM.
*/
function isAudioUploadAllowedInIST() {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  });

  const currentHour = Number(formatter.format(new Date()));

  return currentHour >= 14 && currentHour < 19;
}

/*
  Upload audio buffer to Cloudinary.
*/
function uploadAudioToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "minix/audio-tweets",
        resource_type: "video",
      },
      function (error, result) {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

/*
  Check whether user verified audio_upload OTP recently.
*/
async function hasVerifiedAudioOtp(userId) {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const otpRecord = await Otp.findOne({
    user: userId,
    purpose: "audio_upload",
    verified: true,
    updatedAt: { $gte: tenMinutesAgo },
  }).sort({ updatedAt: -1 });

  return Boolean(otpRecord);
}

/*
  createAudioPost

  Route:
  POST /api/posts/audio

  FormData:
  - audio
  - text
  - duration

  Rules:
  - OTP required
  - max size 100 MB
  - max duration 5 minutes
  - allowed only 2 PM to 7 PM IST
*/
async function createAudioPost(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    if (!isAudioUploadAllowedInIST()) {
      res.status(403);
      throw new Error(
        "Audio tweets are allowed only between 2:00 PM and 7:00 PM IST"
      );
    }

    const otpVerified = await hasVerifiedAudioOtp(req.user._id);

    if (!otpVerified) {
      res.status(403);
      throw new Error("Please verify OTP before uploading an audio tweet");
    }

    if (!req.file) {
      res.status(400);
      throw new Error("Audio file is required");
    }

    const { text = "", duration } = req.body;

    const audioDuration = Number(duration || 0);

    if (!audioDuration || Number.isNaN(audioDuration)) {
      res.status(400);
      throw new Error("Audio duration is required");
    }

    if (audioDuration > 300) {
      res.status(400);
      throw new Error("Audio duration cannot be more than 5 minutes");
    }

    if (req.file.size > 100 * 1024 * 1024) {
      res.status(400);
      throw new Error("Audio file size cannot be more than 100 MB");
    }

    const uploadResult = await uploadAudioToCloudinary(req.file.buffer);

    const post = await Post.create({
      author: req.user._id,
      content: text.trim(),
      type: "audio",
      audioUrl: uploadResult.secure_url,
      audioDuration,
      audioSize: req.file.size,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name username avatar"
    );

    res.status(201).json({
      success: true,
      message: "Audio tweet posted successfully",
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAudioPost,
};