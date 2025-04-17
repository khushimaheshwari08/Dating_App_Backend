const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.signup = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error("Email already in use");
  }

  let hashedPassword = null;
  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 10);
  }

  const user = new User({ ...data, password: hashedPassword });
  await user.save();
  return user;
};
