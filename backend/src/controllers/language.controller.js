const Otp = require("../models/Otp");
const User = require("../models/User");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const { SUPPORTED_LANGUAGES } = require("../constants/languages");

async function sendPhoneOtpDemo({ phone, otp }) {
  console.log(`Demo phone OTP for ${phone}: ${otp}`);
}

async function requestLanguageSwitch(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const { language } = req.body;

    if (!language || !SUPPORTED_LANGUAGES[language]) {
      res.status(400);
      throw new Error("Unsupported language selected");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.preferredLanguage === language) {
      res.status(400);
      throw new Error("This language is already selected");
    }

    const selectedLanguage = SUPPORTED_LANGUAGES[language];
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({
      user: user._id,
      purpose: "language_switch",
      verified: false,
    });

    await Otp.create({
      user: user._id,
      email: user.email,
      phone: user.phone || "",
      otp,
      purpose: "language_switch",
      expiresAt,
      verified: false,
    });

    if (selectedLanguage.otpChannel === "email") {
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>miniX Language Change Verification</h2>
          <p>Hello ${user.name || "User"},</p>
          <p>You requested to switch your language to <strong>${selectedLanguage.name}</strong>.</p>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject: "miniX Language Change OTP",
        html,
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent to registered email",
        channel: "email",
      });
    }

    if (!user.phone) {
      res.status(400);
      throw new Error(
        "Registered mobile number is required to switch to this language"
      );
    }

    await sendPhoneOtpDemo({
      phone: user.phone,
      otp,
    });

    res.status(200).json({
      success: true,
      message:
        "OTP sent to registered mobile number. Demo OTP is printed in backend console.",
      channel: "phone",
    });
  } catch (error) {
    next(error);
  }
}

async function verifyLanguageSwitch(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const { language, otp } = req.body;

    if (!language || !SUPPORTED_LANGUAGES[language]) {
      res.status(400);
      throw new Error("Unsupported language selected");
    }

    if (!otp) {
      res.status(400);
      throw new Error("OTP is required");
    }

    const otpRecord = await Otp.findOne({
      user: req.user._id,
      purpose: "language_switch",
      otp,
      verified: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      res.status(400);
      throw new Error("Invalid OTP");
    }

    if (otpRecord.expiresAt < new Date()) {
      res.status(400);
      throw new Error("OTP expired");
    }

    otpRecord.verified = true;
    await otpRecord.save();

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.preferredLanguage = language;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Language changed to ${SUPPORTED_LANGUAGES[language].name}`,
      preferredLanguage: user.preferredLanguage,
    });
  } catch (error) {
    next(error);
  }
}

async function getMyLanguage(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const user = await User.findById(req.user._id).select(
      "preferredLanguage phone email"
    );

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      preferredLanguage: user.preferredLanguage || "en",
      phone: user.phone || "",
      email: user.email,
      languages: SUPPORTED_LANGUAGES,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  requestLanguageSwitch,
  verifyLanguageSwitch,
  getMyLanguage,
};