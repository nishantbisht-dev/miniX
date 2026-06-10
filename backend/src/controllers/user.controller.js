const User = require("../models/User");

async function syncCurrentUser(req, res, next) {
  try {
    const { uid, email, name, picture } = req.firebaseUser;
    const { username } = req.body;
    let user = await User.findOne({ firebaseUid: uid });
    if (user) return res.status(200).json({ success: true, message: "User already synced", user });

    const baseUsername =
      username ||
      email?.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "") ||
      `user${uid.slice(0, 6)}`;

    let finalUsername = baseUsername;
    let counter = 1;
    while (await User.findOne({ username: finalUsername })) {
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }

    user = await User.create({
      firebaseUid: uid,
      name: name || "miniX User",
      username: finalUsername,
      email,
      avatar: picture || "",
    });

    res.status(201).json({ success: true, message: "User synced successfully", user });
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("MongoDB user profile not found. Please sync user first.");
    }
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
}

async function updateCurrentUser(req, res, next) {
  try {
    if (!req.user) {
      res.status(404);
      throw new Error("User profile not found");
    }
    const { name, username, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (username && username.toLowerCase().trim() !== user.username) {
      const taken = await User.findOne({ username: username.toLowerCase().trim() });
      if (taken) {
        res.status(400);
        throw new Error("Username already taken");
      }
      user.username = username.toLowerCase().trim();
    }
    if (name !== undefined) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();

    const updatedUser = await user.save();
    res.status(200).json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    next(error);
  }
}

async function getUserByUsername(req, res, next) {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase().trim() });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

async function searchUsers(req, res, next) {
  try {
    const searchText = req.query.query || "";
    const filter = searchText
      ? { $or: [{ username: { $regex: searchText, $options: "i" } }, { name: { $regex: searchText, $options: "i" } }] }
      : {};
    const users = await User.find(filter).sort({ createdAt: -1 }).limit(10);
    const filteredUsers = users.filter((user) => user.firebaseUid !== req.firebaseUser.uid);
    res.status(200).json({ success: true, users: filteredUsers });
  } catch (error) {
    next(error);
  }
}

module.exports = { syncCurrentUser, getCurrentUser, updateCurrentUser, getUserByUsername, searchUsers };
