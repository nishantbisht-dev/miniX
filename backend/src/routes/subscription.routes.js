const express = require("express");
const {
  getSubscriptionPlans,
  getMySubscription,
  createRazorpayOrder,
  verifyRazorpayPayment,
  activateSubscriptionManually,
} = require("../controllers/subscription.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

/*
  Public route:
  Frontend can load available subscription plans.
*/
router.get("/plans", getSubscriptionPlans);

/*
  Protected routes:
  User must be logged in.
*/
router.use(protect);

router.get("/me", getMySubscription);
router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);

/*
  Local testing route only.
*/
router.post("/manual-activate", activateSubscriptionManually);

module.exports = router;