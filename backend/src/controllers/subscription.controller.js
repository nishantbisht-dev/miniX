const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Invoice = require("../models/Invoice");
const sendEmail = require("../utils/sendEmail");
const { SUBSCRIPTION_PLANS } = require("../constants/subscriptionPlans");

function isPaymentAllowedInIST() {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  });

  const currentHour = Number(formatter.format(new Date()));

  return currentHour >= 10 && currentHour < 11;
}

function getOneMonthLater() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date;
}

function generateInvoiceNumber() {
  return `MINIX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpaySignature;
}

async function sendSubscriptionInvoiceEmail({
  user,
  plan,
  amount,
  invoiceNumber,
  expiresAt,
  paymentId,
  orderId,
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>miniX Subscription Invoice</h2>

      <p>Hello ${user.name || "User"},</p>
      <p>Your miniX subscription has been activated successfully.</p>

      <h3>Plan Details</h3>
      <p><strong>Plan:</strong> ${plan.toUpperCase()}</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
      <p><strong>Razorpay Order ID:</strong> ${orderId}</p>
      <p><strong>Razorpay Payment ID:</strong> ${paymentId}</p>
      <p><strong>Valid Until:</strong> ${new Date(expiresAt).toLocaleDateString(
        "en-IN"
      )}</p>

      <p>Thank you for using miniX.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "miniX Subscription Invoice",
    html,
  });
}

/*
  GET /api/subscriptions/plans
*/
async function getSubscriptionPlans(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      plans: SUBSCRIPTION_PLANS,
    });
  } catch (error) {
    next(error);
  }
}

/*
  GET /api/subscriptions/me
*/
async function getMySubscription(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const user = await User.findById(req.user._id).select(
      "name email plan subscriptionExpiresAt"
    );

    if (
      user.plan !== "free" &&
      user.subscriptionExpiresAt &&
      user.subscriptionExpiresAt < new Date()
    ) {
      user.plan = "free";
      user.subscriptionExpiresAt = null;
      await user.save();
    }

    const planDetails = SUBSCRIPTION_PLANS[user.plan || "free"];

    res.status(200).json({
      success: true,
      subscription: {
        plan: user.plan || "free",
        subscriptionExpiresAt: user.subscriptionExpiresAt,
        planDetails,
      },
    });
  } catch (error) {
    next(error);
  }
}

/*
  POST /api/subscriptions/create-order

  Body:
  {
    "plan": "bronze"
  }

  This creates Razorpay order.
*/
async function createRazorpayOrder(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    if (!isPaymentAllowedInIST()) {
      res.status(403);
      throw new Error(
        "Payments are allowed only between 10:00 AM and 11:00 AM IST"
      );
    }

    const { plan } = req.body;

    if (!plan || !["bronze", "silver", "gold"].includes(plan)) {
      res.status(400);
      throw new Error("Please select a valid paid plan");
    }

    const planDetails = SUBSCRIPTION_PLANS[plan];

    const order = await razorpay.orders.create({
      amount: planDetails.price * 100,
      currency: "INR",
      receipt: `minix_${Date.now()}`,
      notes: {
        userId: String(req.user._id),
        plan,
      },
    });

    const subscription = await Subscription.create({
      user: req.user._id,
      plan,
      amount: planDetails.price,
      currency: "INR",
      status: "created",
      paymentProvider: "razorpay",
      razorpayOrderId: order.id,
    });

    res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      subscriptionId: subscription._id,
      plan: {
        key: plan,
        name: planDetails.name,
        price: planDetails.price,
      },
      user: {
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

/*
  POST /api/subscriptions/verify-payment

  Body:
  {
    "subscriptionId": "...",
    "razorpay_order_id": "...",
    "razorpay_payment_id": "...",
    "razorpay_signature": "..."
  }

  This verifies payment and activates subscription.
*/
async function verifyRazorpayPayment(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const {
      subscriptionId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !subscriptionId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      res.status(400);
      throw new Error("Payment verification data is missing");
    }

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      user: req.user._id,
      razorpayOrderId: razorpay_order_id,
    });

    if (!subscription) {
      res.status(404);
      throw new Error("Subscription order not found");
    }

    if (subscription.status === "active") {
      res.status(400);
      throw new Error("Subscription is already active");
    }

    const isValidSignature = verifyRazorpaySignature({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    if (!isValidSignature) {
      subscription.status = "failed";
      await subscription.save();

      res.status(400);
      throw new Error("Invalid payment signature");
    }

    const expiresAt = getOneMonthLater();

    subscription.status = "active";
    subscription.startsAt = new Date();
    subscription.expiresAt = expiresAt;
    subscription.razorpayPaymentId = razorpay_payment_id;
    subscription.razorpaySignature = razorpay_signature;
    await subscription.save();

    const user = await User.findById(req.user._id);

    user.plan = subscription.plan;
    user.subscriptionExpiresAt = expiresAt;
    await user.save();

    const invoiceNumber = generateInvoiceNumber();

    const invoice = await Invoice.create({
      user: user._id,
      subscription: subscription._id,
      plan: subscription.plan,
      amount: subscription.amount,
      currency: "INR",
      invoiceNumber,
      paymentProvider: "razorpay",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    await sendSubscriptionInvoiceEmail({
      user,
      plan: subscription.plan,
      amount: subscription.amount,
      invoiceNumber: invoice.invoiceNumber,
      expiresAt,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    res.status(200).json({
      success: true,
      message: `${SUBSCRIPTION_PLANS[subscription.plan].name} plan activated successfully`,
      subscription,
      invoice,
    });
  } catch (error) {
    next(error);
  }
}

/*
  Manual activation kept only for local testing.
*/
async function activateSubscriptionManually(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    if (!isPaymentAllowedInIST()) {
      res.status(403);
      throw new Error(
        "Payments are allowed only between 10:00 AM and 11:00 AM IST"
      );
    }

    const { plan } = req.body;

    if (!plan || !["bronze", "silver", "gold"].includes(plan)) {
      res.status(400);
      throw new Error("Please select a valid paid plan");
    }

    const planDetails = SUBSCRIPTION_PLANS[plan];
    const expiresAt = getOneMonthLater();

    const subscription = await Subscription.create({
      user: req.user._id,
      plan,
      amount: planDetails.price,
      currency: "INR",
      status: "active",
      startsAt: new Date(),
      expiresAt,
      paymentProvider: "manual",
      razorpayOrderId: `manual_order_${Date.now()}`,
      razorpayPaymentId: `manual_payment_${Date.now()}`,
    });

    const user = await User.findById(req.user._id);

    user.plan = plan;
    user.subscriptionExpiresAt = expiresAt;
    await user.save();

    const invoiceNumber = generateInvoiceNumber();

    const invoice = await Invoice.create({
      user: user._id,
      subscription: subscription._id,
      plan,
      amount: planDetails.price,
      currency: "INR",
      invoiceNumber,
      paymentProvider: "manual",
      paymentId: subscription.razorpayPaymentId,
      orderId: subscription.razorpayOrderId,
    });

    await sendSubscriptionInvoiceEmail({
      user,
      plan,
      amount: planDetails.price,
      invoiceNumber: invoice.invoiceNumber,
      expiresAt,
      paymentId: subscription.razorpayPaymentId,
      orderId: subscription.razorpayOrderId,
    });

    res.status(200).json({
      success: true,
      message: `${planDetails.name} plan activated successfully`,
      subscription,
      invoice,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSubscriptionPlans,
  getMySubscription,
  createRazorpayOrder,
  verifyRazorpayPayment,
  activateSubscriptionManually,
};