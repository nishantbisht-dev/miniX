const Otp = require("../models/Otp");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

/*
  Allowed OTP purposes.

  We validate purpose so random values cannot be stored.
*/
const allowedPurposes = [
  "audio_upload",
  "forgot_password",
  "language_switch",
  "chrome_login",
];

/*
  sendOtp sends an OTP to user's email.

  Route:
  POST /api/otp/send

  Body:
  {
    "purpose": "audio_upload"
  }

  For now, this API sends OTP to logged-in user's email.
  Later, for phone OTP, we can add SMS provider.
*/
async function sendOtp(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found. Please sync user first.");
    }

    const { purpose } = req.body;

    if (!purpose || !allowedPurposes.includes(purpose)) {
      res.status(400);
      throw new Error("Invalid OTP purpose");
    }

    /*
      Remove previous unverified OTPs for same user and purpose.
      This keeps only latest OTP active.
    */
    await Otp.deleteMany({
      user: req.user._id,
      purpose,
      verified: false,
    });

    const otp = generateOtp();

    /*
      OTP expiry: 10 minutes.
    */
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({
      user: req.user._id,
      email: req.user.email,
      otp,
      purpose,
      expiresAt,
      verified: false,
    });

    /*
      Email content.
    */
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>miniX Verification Code</h2>
        <p>Hello ${req.user.name},</p>
        <p>Your OTP for <strong>${purpose.replace("_", " ")}</strong> is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: req.user.email,
      subject: "miniX OTP Verification",
      html,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
}

/*
  verifyOtp verifies OTP.

  Route:
  POST /api/otp/verify

  Body:
  {
    "purpose": "audio_upload",
    "otp": "123456"
  }
*/
async function verifyOtp(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found. Please sync user first.");
    }

    const { purpose, otp } = req.body;

    if (!purpose || !allowedPurposes.includes(purpose)) {
      res.status(400);
      throw new Error("Invalid OTP purpose");
    }

    if (!otp) {
      res.status(400);
      throw new Error("OTP is required");
    }

    const otpRecord = await Otp.findOne({
      user: req.user._id,
      purpose,
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

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
}

/*
  checkOtpStatus tells whether user has recently verified OTP for a purpose.

  Route:
  GET /api/otp/status/:purpose

  This is useful before allowing protected actions like audio upload.
*/
async function checkOtpStatus(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found. Please sync user first.");
    }

    const { purpose } = req.params;

    if (!purpose || !allowedPurposes.includes(purpose)) {
      res.status(400);
      throw new Error("Invalid OTP purpose");
    }

    /*
      We consider OTP verified if user verified it within last 10 minutes.
    */
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const verifiedOtp = await Otp.findOne({
      user: req.user._id,
      purpose,
      verified: true,
      updatedAt: { $gte: tenMinutesAgo },
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      verified: Boolean(verifiedOtp),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendOtp,
  verifyOtp,
  checkOtpStatus,
};