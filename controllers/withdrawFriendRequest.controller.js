const FriendRequest = require("../models/friendRequest.model");
const withdrawFriendRequest = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.body;

  try {
    const request = await FriendRequest.findOneAndUpdate(
      { sender: senderId, receiver: receiverId, status: "pending" },
      { status: "withdrawn" }
    );

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "No pending request found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Friend request withdrawn." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { withdrawFriendRequest };
