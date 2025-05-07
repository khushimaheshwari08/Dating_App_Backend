const mongoose = require("mongoose");
const User = require("../models/user.model");
const Liked = require("../models/liked.model");

const getOtherUsers = async (req, res) => {
  try {
    console.log("req", req);
    // 1. Validate the logged-in user ID
    if (!req.user?.id) {
      return res.status(400).json({
        success: false,
        message: "Authentication required",
      });
    }

    // 2. Convert to ObjectId using proper constructor
    const loggedInUserId = new mongoose.Types.ObjectId(req.user.id);
    console.log("loggedInUserId", loggedInUserId);
    // 3. Get list of already liked users
    const likedData = await Liked.findOne({ userId: loggedInUserId });
    const likedUserIds = (likedData?.likedUserIds || []).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // 4. Combine all IDs to exclude
    const excludeIds = [loggedInUserId, ...likedUserIds];

    // 5. Find users who meet the criteria
    const users = await User.find({
      _id: { $nin: excludeIds },
      profileCompleted: true,
    }).select("-password -__v -createdAt -updatedAt");
    const filteredUsers = users.filter(user => user.userId.toString() !== loggedInUserId.toString());

    res.status(200).json({
      success: true,
      // count: filteredUsers.length,
      filteredUsers,
    });
  } catch (error) {
    console.error("Error in getOtherUsers:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getOtherUsers };
