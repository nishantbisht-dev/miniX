const Post = require("../models/Post");
const User = require("../models/User");
const { SUBSCRIPTION_PLANS } = require("../constants/subscriptionPlans");

function getMonthRange() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfNextMonth = new Date(startOfMonth);
  startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);

  return {
    startOfMonth,
    startOfNextMonth,
  };
}

async function checkTweetLimit(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    /*
      If subscription expired, automatically downgrade to free.
    */
    if (
      user.plan !== "free" &&
      user.subscriptionExpiresAt &&
      user.subscriptionExpiresAt < new Date()
    ) {
      user.plan = "free";
      user.subscriptionExpiresAt = null;
      await user.save();
    }

    const activePlan = user.plan || "free";
    const planDetails = SUBSCRIPTION_PLANS[activePlan];

    if (activePlan === "gold") {
      return next();
    }

    const { startOfMonth, startOfNextMonth } = getMonthRange();

    const postsThisMonth = await Post.countDocuments({
      author: req.user._id,
      createdAt: {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      },
    });

    if (postsThisMonth >= planDetails.tweetLimit) {
      res.status(403);
      throw new Error(
        `Your ${planDetails.name} plan allows only ${planDetails.tweetLimit} tweet(s) this month. Please upgrade your plan.`
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkTweetLimit,
};