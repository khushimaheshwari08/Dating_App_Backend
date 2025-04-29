const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Add this line
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileCompleted: { type: Boolean, default: false },
    firstName: String,
    birthday: Date,
    gender: String,
    interestedIn: [String],
    lookingFor: [String],
    interests: [String],
    sexualOrientation: [String],
  },
  { timestamps: true }
);

// Verify the model is properly compiled
const User = mongoose.model("User", userSchema);

// Test the model methods (temporary debug)
console.log("[DEBUG] User model methods:", {
  findByIdAndUpdate: typeof User.findByIdAndUpdate,
  prototype: Object.getPrototypeOf(User),
});

module.exports = User;
