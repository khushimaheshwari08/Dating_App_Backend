const bcrypt = require("bcryptjs");
const Auth = require("../models/auth.model");
const User = require("../models/user.model");

const registerUser = async ({ name, email, password }) => {
  // Add name parameter
  const userExists = await Auth.findOne({ email });
  if (userExists) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await Auth.create({
    name, // Include name in creation
    email,
    password: hashedPassword,
  });
};

const loginUser = async (email, password) => {
  const user = await Auth.findOne({ email }).select("+password");
  // console.log("user",user)
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    console.log("condition match")
    const userProfile = await User.findOne({userId:user._id });
    console.log("userProfile", userProfile);
    return userProfile;
  }
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // return user;
};

module.exports = { registerUser, loginUser };
