const User = require("../models/user.model");
const generateToken = require("../utils/generateToken"); // Add this import

const completeProfile = async (req, res) => {
  try {
    const { userId, firstName, birthday, gender, interestedIn, lookingFor } =
      req.body;

    if (!userId || !firstName || !birthday || !gender || !interestedIn) {
      return res.status(400).json({
        success: false,
        message: "All profile fields are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        birthday: new Date(birthday),
        gender,
        interestedIn,
        lookingFor,
        profileCompleted: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      token: generateToken(updatedUser._id), // Now this will work
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { completeProfile };
