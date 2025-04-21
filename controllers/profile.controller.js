const mongoose = require("mongoose");

// Method 1: Direct model access (bypass any import issues)
const User = mongoose.model("User");

// Method 2: Verify the import (comment out Method 1 if using this)
// const User = require('../models/user.model');

const completeProfile = async (req, res) => {
  try {
    // Debug: Verify model methods

    const { userId, ...profileData } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Convert birthday if needed
    if (profileData.birthday) {
      profileData.birthday = new Date(profileData.birthday);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...profileData, profileCompleted: true },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("[ERROR] Profile completion failed:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = { completeProfile };
