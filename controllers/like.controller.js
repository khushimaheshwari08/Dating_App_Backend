const Liked = require("../models/liked.model");
const User = require("../models/user.model"); // ✅ ADD THIS

const likeUser = async (req, res) => {
  const { likedUserId } = req.body;
  const userId = req.user.id;
  try {
    const likedUser = await User.findOne({userId:likedUserId});
    if (!likedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let likedData = await Liked.findOne({ userId });
    if (!likedData) {
      likedData = new Liked({ userId, likedUserIds: [likedUser._id] });
    } else {
      if (!likedData.likedUserIds.includes(likedUser._id.toString())) {
        likedData.likedUserIds.push(likedUser._id);
      }
    }

    await likedData.save();

    res
      .status(200)
      .json({ success: true, message: "User liked successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { likeUser };
