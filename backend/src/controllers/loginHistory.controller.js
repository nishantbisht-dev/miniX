const UAParser = require("ua-parser-js");
const LoginHistory = require("../models/LoginHistory");

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket.remoteAddress || req.ip || "Unknown";
}

function getDeviceCategory(deviceType) {
  if (deviceType === "mobile") return "mobile";
  if (deviceType === "tablet") return "tablet";
  if (!deviceType) return "desktop";

  return "unknown";
}

function getLoginMeta(req) {
  const parser = new UAParser(req.headers["user-agent"] || "");
  const result = parser.getResult();

  return {
    browser: result.browser.name || "Unknown",
    os: result.os.name || "Unknown",
    device: getDeviceCategory(result.device.type),
    ipAddress: getClientIp(req),
  };
}

async function saveLoginHistory(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const meta = getLoginMeta(req);

    const history = await LoginHistory.create({
      user: req.user._id,
      browser: meta.browser,
      os: meta.os,
      device: meta.device,
      ipAddress: meta.ipAddress,
      status: "success",
      reason: "Normal login",
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
  getLoginMeta,
};