const authService = require("../services/auth.service");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await authService.registerUser({ email, password });

    // Return both userId AND temporary token for profile completion
    const profileCompletionToken = generateToken(user._id, "15m"); // Short-lived token

    res.status(201).json({
      success: true,
      userId: user._id,
      tempToken: profileCompletionToken, // For immediate profile completion
      message: "Registration successful - Complete your profile",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await authService.loginUser(email, password);

    // Convert Mongoose document to plain object and remove password
    const userObject = user.toObject();
    delete userObject.password;

    if (!user.profileCompleted) {
      return res.status(200).json({
        success: true,
        profileCompleted: false,
        message: "Please complete your profile",
        userId: user._id,
        user: userObject, // Still return all available data
      });
    }

    res.status(200).json({
      success: true,
      profileCompleted: true,
      token: generateToken(user._id),
      user: userObject, // Returns ALL user data except password
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };
