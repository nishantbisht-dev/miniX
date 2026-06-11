const express = require("express");
const {
  sendOtp,
  verifyOtp,
  checkOtpStatus,
} = require("../controllers/otp.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

/*
  All OTP routes require Firebase Auth token.

  This means user must be logged in before requesting OTP
  for protected actions like audio upload or language switch.
*/

router.use(protect);

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);
router.get("/status/:purpose", checkOtpStatus);

module.exports = router;