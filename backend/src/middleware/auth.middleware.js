const adminAuth = require("../config/firebaseAdmin");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no Firebase token provided");
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.firebaseUser = decodedToken;
    req.user = await User.findOne({ firebaseUid: decodedToken.uid });
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
}

module.exports = { protect };
