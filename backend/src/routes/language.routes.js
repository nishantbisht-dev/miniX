const express = require("express");
const {
  requestLanguageSwitch,
  verifyLanguageSwitch,
  getMyLanguage,
} = require("../controllers/language.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/me", getMyLanguage);
router.post("/request-switch", requestLanguageSwitch);
router.post("/verify-switch", verifyLanguageSwitch);

module.exports = router;