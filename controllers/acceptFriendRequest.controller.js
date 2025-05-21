const FriendRequest = require("../models/friendRequest.model");

const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user
    const { requestId } = req.body;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.receiver.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    request.status = "accepted";
    await request.save();

    res.status(200).json({ success: true, message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { acceptFriendRequest };
