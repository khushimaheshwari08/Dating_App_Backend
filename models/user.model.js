const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true }, // Add this line
    profileCompleted: { type: Boolean, default: false },
    name: String,
    birthday: Date,
    gender: String,
    interestedIn: [String],
    lookingFor: [String],
    interests: [String],
    sexualOrientation: [String],
    aboutMe: String,
  },
  { timestamps: true }
);

// Verify the model is properly compiled
const User = mongoose.model("User", userSchema);

module.exports = User;
