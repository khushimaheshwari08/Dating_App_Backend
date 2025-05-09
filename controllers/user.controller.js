const mongoose = require("mongoose");
const User = require("../models/user.model");
const Liked = require("../models/liked.model");

// Get other users
const getOtherUsers = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(400).json({
        success: false,
        message: "Authentication required",
      });
    }

    const loggedInUserId = new mongoose.Types.ObjectId(req.user.id);
    const likedData = await Liked.findOne({ userId: loggedInUserId });
    const likedUserIds = (likedData?.likedUserIds || []).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const excludeIds = [loggedInUserId, ...likedUserIds];

    const users = await User.find({
      _id: { $nin: excludeIds },
      profileCompleted: true,
    }).select("-password -__v -createdAt -updatedAt");

    const filteredUsers = users.filter(
      (user) => user.userId.toString() !== loggedInUserId.toString()
    );

    res.status(200).json({
      success: true,
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

// Get logged-in user
const getLoggedInUser = async (req, res) => {
  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.user.id);
    const user = await User.findOne({ userId: loggedInUserId });
    if (!loggedInUserId || !user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateLoggedInUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res
        .status(400)
        .json({ success: false, message: "Authentication required" });
    }
    const loggedInUserId = new mongoose.Types.ObjectId(req.user.id);
    const updatedUser = await User.findOneAndUpdate(
      { userId: loggedInUserId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -__v");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { getOtherUsers, getLoggedInUser, updateLoggedInUser };
