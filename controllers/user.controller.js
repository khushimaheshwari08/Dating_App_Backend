const mongoose = require("mongoose");
const User = require("../models/user.model");
const Liked = require("../models/liked.model");
const FriendRequest = require("../models/friendRequest.model");

// Get other users

const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    // Get current user's profile
    const currentUser = await User.findOne({ userId: loggedInUserId });
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Setup gender preference
    const interestedIn = currentUser.interestedIn || [];
    const interestedInEveryone = interestedIn.includes("Everyone");

    const genderMap = { Woman: "Female", Man: "Male" };
    const genderFilter = interestedIn.map((i) => genderMap[i]).filter(Boolean);

    // Get liked user IDs
    const likedData = await Liked.findOne({ userId: loggedInUserId });
    const likedUserIds = (likedData?.likedUserIds || []).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Get all friend requests (sent and received)
    const sentRequests = await FriendRequest.find({ sender: loggedInUserId });
    const receivedRequests = await FriendRequest.find({
      receiver: loggedInUserId,
    });

    // Build sets of accepted users
    const acceptedSent = new Set(
      sentRequests
        .filter((r) => r.status === "accepted")
        .map((r) => r.receiver.toString())
    );
    const acceptedReceived = new Set(
      receivedRequests
        .filter((r) => r.status === "accepted")
        .map((r) => r.sender.toString())
    );

    // Find mutual matches (accepted both ways)
    const mutualMatches = [...acceptedSent].filter((id) =>
      acceptedReceived.has(id)
    );

    // Get users you sent any requests to (to exclude)
    const requestedUserIds = sentRequests.map((r) => r.receiver);

    // Convert mutual match userIds to _id via User lookup
    const mutualMatchedUsers = await User.find({
      userId: { $in: mutualMatches },
    });
    const mutualMatchedUserIds = mutualMatchedUsers.map((u) => u._id);

    // Final exclusion list
    const excludeIds = [
      currentUser._id,
      ...likedUserIds,
      ...mutualMatchedUserIds,
    ];

    // Also exclude users who received your request
    const requestedUsers = await User.find({
      userId: { $in: requestedUserIds },
    });
    const requestedUserObjectIds = requestedUsers.map((u) => u._id);
    excludeIds.push(...requestedUserObjectIds);

    // Build user query
    const query = {
      _id: { $nin: excludeIds },
      profileCompleted: true,
    };

    if (!interestedInEveryone) {
      query.gender = { $in: genderFilter };
    }

    // Fetch filtered users
    const users = await User.find(query).select(
      "-password -__v -createdAt -updatedAt"
    );

    res.status(200).json({
      success: true,
      filteredUsers: users,
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
