const User = require("../models/user.model");
const Auth = require("../models/auth.model");
const generateToken = require("../utils/generateToken");
const completeProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userExists = await Auth.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found - please register first",
      });
    }

    const requiredFields = ["name", "birthday", "gender"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Corrected create call
    const userData = {
      userId,
      ...req.body,
      birthday: new Date(req.body.birthday),
      profileCompleted: true
    };

    const updatedUser = await User.create(userData);

    // Convert to object and remove password if it exists
    const userObject = updatedUser.toObject();
    delete userObject.password;

    res.status(200).json({
      success: true,
      token: generateToken(updatedUser._id),
      user: userObject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { completeProfile };
