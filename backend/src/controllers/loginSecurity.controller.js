const UAParser = require("ua-parser-js");
const Otp = require("../models/Otp");
const LoginHistory = require("../models/LoginHistory");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

/*
  Extract IP address from request.

  On localhost, this can be ::1 or 127.0.0.1.
  On deployed Render backend, x-forwarded-for usually contains real client IP.
*/
function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket.remoteAddress || req.ip || "Unknown";
}

/*
  Convert user-agent device type into our fixed values.
*/
function getDeviceCategory(deviceType) {
  if (deviceType === "mobile") {
    return "mobile";
  }

  if (deviceType === "tablet") {
    return "tablet";
  }

  if (!deviceType) {
    return "desktop";
  }

  return "unknown";
}

/*
  Check if current IST time is between 10:00 AM and 1:00 PM.

  Mobile login is allowed only in this time window.
*/
function isMobileLoginAllowedInIST() {
  const now = new Date();

  const istFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  });

  const currentHour = Number(istFormatter.format(now));

  return currentHour >= 10 && currentHour < 13;
}

/*
  Parse browser, OS, device, and IP from request.
*/
function getLoginMeta(req) {
  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();

  const browser = result.browser.name || "Unknown";
  const os = result.os.name || "Unknown";
  const device = getDeviceCategory(result.device.type);
  const ipAddress = getClientIp(req);

  return {
    browser,
    os,
    device,
    ipAddress,
  };
}

/*
  checkLoginSecurity

  Route:
  POST /api/login-security/check

  This route is called after Firebase login succeeds.

  Rules:
  1. Mobile login allowed only between 10 AM and 1 PM IST.
  2. Chrome browser requires OTP sent to registered email.
  3. Microsoft Edge browser is allowed without OTP.
  4. Other browsers are allowed directly.
*/
async function checkLoginSecurity(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const { browser, os, device, ipAddress } = getLoginMeta(req);

    /*
      Mobile restriction:
      If user logs in from mobile outside allowed time,
      block access and save blocked login record.
    */
    if (device === "mobile" && !isMobileLoginAllowedInIST()) {
      await LoginHistory.create({
        user: req.user._id,
        browser,
        os,
        device,
        ipAddress,
        status: "blocked",
      });

      return res.status(403).json({
        success: false,
        action: "blocked",
        message: "Mobile login is allowed only between 10:00 AM and 1:00 PM IST",
      });
    }

    /*
      Chrome rule:
      Google Chrome users must verify email OTP.
    */
    const normalizedBrowser = browser.toLowerCase();

    const isChrome =
      normalizedBrowser.includes("chrome") &&
      !normalizedBrowser.includes("edge") &&
      !normalizedBrowser.includes("edg");

    if (isChrome) {
      /*
        Remove old unverified chrome_login OTPs for this user.
      */
      await Otp.deleteMany({
        user: req.user._id,
        purpose: "chrome_login",
        verified: false,
      });

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await Otp.create({
        user: req.user._id,
        email: req.user.email,
        otp,
        purpose: "chrome_login",
        expiresAt,
        verified: false,
      });

      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>miniX Chrome Login Verification</h2>
          <p>Hello ${req.user.name},</p>
          <p>You are trying to login from Google Chrome.</p>
          <p>Your login verification OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If this was not you, please secure your account.</p>
        </div>
      `;

      await sendEmail({
        to: req.user.email,
        subject: "miniX Chrome Login OTP",
        html,
      });

      return res.status(200).json({
        success: true,
        action: "requires_otp",
        message: "Chrome login requires email OTP verification",
      });
    }

    /*
      Microsoft Edge and other browsers:
      Allow login directly and save successful login history.
    */
    const history = await LoginHistory.create({
      user: req.user._id,
      browser,
      os,
      device,
      ipAddress,
      status: "success",
    });

    return res.status(200).json({
      success: true,
      action: "allowed",
      message: "Login allowed",
      history,
    });
  } catch (error) {
    next(error);
  }
}

/*
  completeChromeLogin

  Route:
  POST /api/login-security/complete-chrome-login

  Body:
  {
    "otp": "123456"
  }

  This route verifies Chrome login OTP and saves successful login history.
*/
async function completeChromeLogin(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const { otp } = req.body;

    if (!otp) {
      res.status(400);
      throw new Error("OTP is required");
    }

    const otpRecord = await Otp.findOne({
      user: req.user._id,
      purpose: "chrome_login",
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

    const { browser, os, device, ipAddress } = getLoginMeta(req);

    const history = await LoginHistory.create({
      user: req.user._id,
      browser,
      os,
      device,
      ipAddress,
      status: "success",
    });

    return res.status(200).json({
      success: true,
      action: "allowed",
      message: "Chrome login verified successfully",
      history,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkLoginSecurity,
  completeChromeLogin,
};