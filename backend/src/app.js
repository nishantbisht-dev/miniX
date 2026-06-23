const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const socialRoutes = require("./routes/social.routes");
const notificationRoutes = require("./routes/notification.routes");
const otpRoutes = require("./routes/otp.routes");
const loginHistoryRoutes = require("./routes/loginHistory.routes");
const loginSecurityRoutes = require("./routes/loginSecurity.routes");
const forgotPasswordRoutes = require("./routes/forgotPassword.routes");
const audioPostRoutes = require("./routes/audioPost.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const languageRoutes = require("./routes/language.routes");

const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "miniX backend API is running",
    health: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "miniX API is running",
  });
});

/*
  API routes
*/
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/login-history", loginHistoryRoutes);
app.use("/api/login-security", loginSecurityRoutes);
app.use("/api/forgot-password", forgotPasswordRoutes);
app.use("/api/posts/audio", audioPostRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/languages", languageRoutes);

/*
  Error handlers must always be last.
*/
app.use(notFound);
app.use(errorHandler);

module.exports = app;