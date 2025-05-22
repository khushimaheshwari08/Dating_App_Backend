const mongoose = require("mongoose");
const User = require("../models/user.model");
const Liked = require("../models/liked.model");

// Get other users

// const getOtherUsers = async (req, res) => {
//   try {
//     const loggedInUserId = new mongoose.Types.ObjectId(req.user.id);

//     // 🔹 Fetch current user's profile
//     const currentUser = await User.findOne({ userId: loggedInUserId });
//     if (!currentUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const interestedIn = currentUser.interestedIn || [];

//     // 🔹 Check if user selected "Everyone"
//     const interestedInEveryone = interestedIn.includes("Everyone");

//     const genderMap = { Woman: "Female", Man: "Male" };
//     const genderFilter = interestedIn.map((i) => genderMap[i]).filter(Boolean); // remove undefined

//     // 🔹 Get liked users
//     const likedData = await Liked.findOne({ userId: loggedInUserId });
//     const likedUserIds = (likedData?.likedUserIds || []).map(
//       (id) => new mongoose.Types.ObjectId(id)
//     );

//     const excludeIds = [currentUser._id, ...likedUserIds];

//     // 🔹 Build user query
//     const query = {
//       _id: { $nin: excludeIds },
//       profileCompleted: true,
//     };

//     if (!interestedInEveryone) {
//       query.gender = { $in: genderFilter };
//     }

//     // 🔹 Fetch users
//     const users = await User.find(query).select(
//       "-password -__v -createdAt -updatedAt"
//     );

//     res.status(200).json({
//       success: true,
//       filteredUsers: users,
//     });
//   } catch (error) {
//     console.error("Error in getOtherUsers:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const mongoose = require("mongoose");
const User = require("../models/user.model");
const Liked = require("../models/liked.model");
const FriendRequest = require("../models/friendRequest.model");

const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.user.id);

    // 🔹 Get logged-in user's profile
    const currentUser = await User.findOne({ userId: loggedInUserId });
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔹 Gender filter setup
    const interestedIn = currentUser.interestedIn || [];
    const interestedInEveryone = interestedIn.includes("Everyone");

    const genderMap = { Woman: "Female", Man: "Male" };
    const genderFilter = interestedIn.map((i) => genderMap[i]).filter(Boolean);

    // 🔹 Get liked user IDs
    const likedData = await Liked.findOne({ userId: loggedInUserId });
    const likedUserIds = (likedData?.likedUserIds || []).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // 🔹 Get pending friend request receivers
    const sentRequests = await FriendRequest.find({
      sender: loggedInUserId,
      status: "pending",
    });
    const requestedUserIds = sentRequests.map(
      (req) => new mongoose.Types.ObjectId(req.receiver)
    );

    // 🔹 Final exclusion list
    const excludeIds = [currentUser._id, ...likedUserIds, ...requestedUserIds];

    // 🔹 Build query
    const query = {
      _id: { $nin: excludeIds },
      profileCompleted: true,
    };

    if (!interestedInEveryone) {
      query.gender = { $in: genderFilter };
    }

    // 🔹 Fetch filtered users
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
