const express = require("express");
const { forgotPassword } = require("../controllers/forgotPassword.controller");

const router = express.Router();

/*
  Public route.

  User is not logged in during forgot password flow.
*/
router.post("/", forgotPassword);

module.exports = router;