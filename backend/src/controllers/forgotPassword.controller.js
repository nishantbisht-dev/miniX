const adminAuth = require("../config/firebaseAdmin");
const User = require("../models/User");
const PasswordResetRequest = require("../models/PasswordResetRequest");
const generateLetterPassword = require("../utils/generateLetterPassword");
const sendEmail = require("../utils/sendEmail");

/*
  Check whether the user has already requested password reset today.

  We compare from today's 00:00 to tomorrow's 00:00.
*/
function getTodayRange() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  return {
    startOfToday,
    startOfTomorrow,
  };
}

/*
  forgotPassword

  Route:
  POST /api/forgot-password

  Body:
  {
    "identifier": "user@gmail.com"
  }

  identifier can be:
  - email
  - phone number

  Flow:
  1. Find user by email or phone
  2. Check one reset per day rule
  3. Generate random letter-only password
  4. Update Firebase password using Firebase Admin SDK
  5. Save reset request
  6. Send generated password to registered email
*/
async function forgotPassword(req, res, next) {
  try {
    const { identifier } = req.body;

    if (!identifier || !identifier.trim()) {
      res.status(400);
      throw new Error("Email or phone number is required");
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    const user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { phone: identifier.trim() }],
    });

    if (!user) {
      res.status(404);
      throw new Error("No account found with this email or phone number");
    }

    const { startOfToday, startOfTomorrow } = getTodayRange();

    const alreadyRequestedToday = await PasswordResetRequest.findOne({
      $or: [
        { firebaseUid: user.firebaseUid },
        { email: user.email },
        { phone: user.phone || "" },
      ],
      requestedAt: {
        $gte: startOfToday,
        $lt: startOfTomorrow,
      },
    });

    if (alreadyRequestedToday) {
      res.status(429);
      throw new Error("You can use this option only one time per day.");
    }

    const newPassword = generateLetterPassword(10);

    /*
      Update password in Firebase Auth.

      miniX uses Firebase Auth, so password must be changed there.
    */
    await adminAuth.updateUser(user.firebaseUid, {
      password: newPassword,
    });

    await PasswordResetRequest.create({
      firebaseUid: user.firebaseUid,
      email: user.email,
      phone: user.phone || "",
      requestedAt: new Date(),
    });

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>miniX Password Reset</h2>
        <p>Hello ${user.name || "User"},</p>
        <p>Your password has been reset successfully.</p>
        <p>Your new password is:</p>
        <h2 style="letter-spacing: 2px;">${newPassword}</h2>
        <p>This password contains only uppercase and lowercase letters.</p>
        <p>Please login using this password and change it later if needed.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "miniX New Password",
      html,
    });

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. New password has been sent to your registered email.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  forgotPassword,
};