const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileCompleted: { type: Boolean, default: false },
    // Profile fields (will be added later)
    firstName: String,
    birthday: Date,
    gender: String,
    interestedIn: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
