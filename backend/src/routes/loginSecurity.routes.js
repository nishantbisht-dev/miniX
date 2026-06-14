const express = require("express");
const {
  checkLoginSecurity,
  completeChromeLogin,
} = require("../controllers/loginSecurity.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/check", checkLoginSecurity);
router.post("/complete-chrome-login", completeChromeLogin);

module.exports = router;