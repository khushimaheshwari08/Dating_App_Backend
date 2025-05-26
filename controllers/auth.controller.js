const authService = require("../services/auth.service");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Destructure name

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const user = await authService.registerUser({ name, email, password });
    const profileCompletionToken = generateToken(user._id, "15m");

    res.status(201).json({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      tempToken: profileCompletionToken,
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

    // Convert Mongoose document to plain object if needed
    const userObject = user.toObject ? user.toObject() : { ...user };

    // Optionally remove sensitive fields
    // delete userObject.password;

    // Ensure userId is included inside user object
    userObject.userId = user._id;

    if (!user.profileCompleted) {
      return res.status(200).json({
        success: true,
        profileCompleted: false,
        message: "Please complete your profile",
        user: userObject,
      });
    }

    res.status(200).json({
      success: true,
      profileCompleted: true,
      token: generateToken(user._id),
      user: userObject,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };
