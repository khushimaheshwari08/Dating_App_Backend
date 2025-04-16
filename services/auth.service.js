const bcrypt = require("bcrypt");
const User = require("../models/user.model");

exports.signup = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = new User({ ...data, password: hashedPassword });
  await user.save();
  return user;
};
