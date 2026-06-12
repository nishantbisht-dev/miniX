const express = require("express");
const {
  checkLoginSecurity,
  completeChromeLogin,
} = require("../controllers/loginSecurity.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

/*
  Login security routes are protected because Firebase login happens first.
  After Firebase login, backend applies extra security rules.
*/

router.use(protect);

router.post("/check", checkLoginSecurity);
router.post("/complete-chrome-login", completeChromeLogin);

module.exports = router;