const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Add this line
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileCompleted: { type: Boolean, default: false },
   
  },
  { timestamps: true }
);

// Verify the model is properly compiled
const Auth = mongoose.model("Auth", userSchema);

module.exports = Auth;
