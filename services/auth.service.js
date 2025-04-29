const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const registerUser = async ({ name, email, password }) => {
  // Add name parameter
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({
    name, // Include name in creation
    email,
    password: hashedPassword,
  });
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

module.exports = { registerUser, loginUser };
