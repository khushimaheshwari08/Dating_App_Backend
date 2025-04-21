const User = require("../models/user.model");

const completeProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    // 1. Verify userId exists in request
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // 2. Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found - please register first",
      });
    }

    // 3. Validate required fields
    const requiredFields = ["firstName", "birthday", "gender"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // 4. Update profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        birthday: new Date(req.body.birthday),
        profileCompleted: true,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { completeProfile };
