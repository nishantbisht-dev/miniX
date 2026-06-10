const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const socialRoutes = require("./routes/social.routes");
const notificationRoutes = require("./routes/notification.routes");

const { notFound, errorHandler } = require("./middleware/error.middleware");

/*
  app.js configures our Express application.

  server.js starts the server.
*/

const app = express();

/*
  Security headers.
*/
app.use(helmet());

/*
  Log API requests in development/production logs.
*/
app.use(morgan("dev"));

/*
  Allow frontend to call backend.
*/
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/*
  Body parsers.
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*
  Root route.

  This appears when someone opens the Render backend URL directly.
*/
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "miniX backend API is running",
    health: "/api/health",
  });
});

/*
  Health check route.

  Test:
  /api/health
*/
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "miniX API is running",
  });
});

/*
  Main API routes.
*/
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/notifications", notificationRoutes);

/*
  Error handlers.
*/
app.use(notFound);
app.use(errorHandler);

module.exports = app;