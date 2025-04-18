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

    res.status(201).json({
      success: true,
      message: "Registration successful - Complete your profile",
      userId: user._id, // Send userId for profile completion
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

    if (!user.profileCompleted) {
      return res.status(200).json({
        success: true,
        profileCompleted: false,
        message: "Please complete your profile",
        userId: user._id,
      });
    }

    res.status(200).json({
      success: true,
      profileCompleted: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };
