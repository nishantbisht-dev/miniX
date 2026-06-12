const express = require("express");
const {
  saveLoginHistory,
  getMyLoginHistory,
} = require("../controllers/loginHistory.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

/*
  All login history routes require logged-in user.
*/

router.use(protect);

router.post("/", saveLoginHistory);
router.get("/me", getMyLoginHistory);

module.exports = router;