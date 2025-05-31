const FriendRequest = require("../models/friendRequest.model");
const User = require("../models/user.model");

const getMutualFriendsForChat = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all accepted requests where logged-in user is sender
    const acceptedByUser = await FriendRequest.find({
      sender: userId,
      status: "accepted",
    });

    // Get all accepted requests where logged-in user is receiver
    const acceptedByOthers = await FriendRequest.find({
      receiver: userId,
      status: "accepted",
    });

    // Create sets for easy lookup
    const sentTo = new Set(
      acceptedByUser.map((req) => req.receiver.toString())
    );
    const receivedFrom = new Set(
      acceptedByOthers.map((req) => req.sender.toString())
    );

    // Find mutual matches (intersection of both sets)
    const mutualUserIds = [...sentTo].filter((userId) =>
      receivedFrom.has(userId)
    );

    // Fetch mutual user profiles
    const mutualUsers = await User.find({
      userId: { $in: mutualUserIds },
    }).select("userId name gender birthday image");

    res.status(200).json({
      success: true,
      mutualChats: mutualUsers,
    });
  } catch (error) {
    console.error("Error in getMutualFriendsForChat:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMutualFriendsForChat };
