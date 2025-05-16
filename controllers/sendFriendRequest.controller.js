const FriendRequest = require("../models/friendRequest.model");

const sendFriendRequest = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.body;
  try {
    // check if already sent
    const existing = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Request already sent." });
    }

    const request = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
    });

    await request.save();

    res.status(200).json({ success: true, message: "Friend request sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { sendFriendRequest };
