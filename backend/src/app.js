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

const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => res.status(200).json({ success: true, message: "miniX API is running" }));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
