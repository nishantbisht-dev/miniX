const UAParser = require("ua-parser-js");
const LoginHistory = require("../models/LoginHistory");

/*
  getClientIp extracts IP address from request.

  On localhost, IP may look like ::1 or 127.0.0.1.
  On deployed backend, it can come from x-forwarded-for header.
*/
function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket.remoteAddress || req.ip || "Unknown";
}

/*
  getDeviceCategory converts ua-parser device type into our fixed values.

  Browser user-agent may return:
  - mobile
  - tablet
  - undefined

  If undefined, we consider it desktop.
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
  saveLoginHistory

  Route:
  POST /api/login-history

  This route will be called after user logs in successfully.
*/
async function saveLoginHistory(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    const browser = result.browser.name || "Unknown";
    const os = result.os.name || "Unknown";
    const device = getDeviceCategory(result.device.type);
    const ipAddress = getClientIp(req);

    const history = await LoginHistory.create({
      user: req.user._id,
      browser,
      os,
      device,
      ipAddress,
      status: "success",
    });

    res.status(201).json({
      success: true,
      message: "Login history saved successfully",
      history,
    });
  } catch (error) {
    next(error);
  }
}

/*
  getMyLoginHistory

  Route:
  GET /api/login-history/me

  Returns logged-in user's latest login history records.
*/
async function getMyLoginHistory(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const history = await LoginHistory.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  saveLoginHistory,
  getMyLoginHistory,
};