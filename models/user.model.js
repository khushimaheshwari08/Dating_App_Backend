const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthday: {
      day: Number,
      month: Number,
      year: Number,
    },
    gender: String,
    showGender: Boolean,
    interestedIn: [String], // ['Men', 'Women', 'Everyone']
    relationshipIntent: String,
    interests: [String],
    sexualOrientation: String,
    profilePhotos: [String], // URLs or paths
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
