// const User = require("../models/user.model");
// const Auth = require("../models/auth.model");
// const generateToken = require("../utils/generateToken");

// const completeProfile = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required",
//       });
//     }

//     const userExists = await Auth.findById(userId);
//     if (!userExists) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found - please register first",
//       });
//     }

//     const requiredFields = ["name", "birthday", "gender"];
//     const missingFields = requiredFields.filter((field) => !req.body[field]);

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Missing required fields: ${missingFields.join(", ")}`,
//       });
//     }

//     const userData = {
//       userId,
//       ...req.body,
//       birthday: new Date(req.body.birthday),
//       profileCompleted: true
//     };

//     // Corrected findOneAndUpdate - added the update data (userData)
//     const updatedUser = await User.findOneAndUpdate(
//       { userId },
//       userData, // This was missing in your code
//       {
//         new: true,
//         upsert: true,
//         setDefaultsOnInsert: true
//       }
//     );

//     // Update Auth model's profileCompleted status
//      await Auth.findByIdAndUpdate(
//       userId, // Using just the ID since it's findByIdAndUpdate
//       { profileCompleted: true },
//       { new: true }
//     );

//     // Convert to object and remove password if it exists
//     const userObject = updatedUser.toObject();
//     delete userObject.password;

//     res.status(200).json({
//       success: true,
//       token: generateToken(updatedUser._id),
//       user: userObject,
//     });
//   } catch (error) {
//     // Handle duplicate key errors specifically
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "User profile already exists for this ID"
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
const User = require("../models/user.model");
const Auth = require("../models/auth.model");
const generateToken = require("../utils/generateToken");

const completeProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const userExists = await Auth.findById(userId);
    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const requiredFields = ["name", "birthday", "gender"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Extract image URLs from req.files (Cloudinary stores path as URL)
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    }

    // Ensure string arrays are properly formatted
    const formattedUserData = {
      userId,
      name: req.body.name,
      birthday: new Date(req.body.birthday),
      gender: req.body.gender,
      showGender:
        req.body.showGender === "true" || req.body.showGender === true,
      interestedIn: Array.isArray(req.body.interestedIn)
        ? req.body.interestedIn
        : req.body.interestedIn?.split(","),
      lookingFor: Array.isArray(req.body.lookingFor)
        ? req.body.lookingFor
        : req.body.lookingFor?.split(","),
      interests: Array.isArray(req.body.interests)
        ? req.body.interests
        : req.body.interests?.split(","),
      sexualOrientation: Array.isArray(req.body.sexualOrientation)
        ? req.body.sexualOrientation
        : req.body.sexualOrientation?.split(","),
      aboutMe: req.body.aboutMe || "",
      profileCompleted: true,
    };

    if (imageUrls.length > 0) {
      formattedUserData.image = imageUrls;
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      formattedUserData,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    await Auth.findByIdAndUpdate(
      userId,
      { profileCompleted: true },
      { new: true }
    );

    const userObject = updatedUser.toObject();
    delete userObject.password;

    res.status(200).json({
      success: true,
      token: generateToken(updatedUser._id),
      user: userObject,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User profile already exists for this ID",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { completeProfile };
