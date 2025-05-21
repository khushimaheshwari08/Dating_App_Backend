const FriendRequest = require("../models/friendRequest.model");

const deleteFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
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

    if (request.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an accepted request",
      });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ success: true, message: "Friend request deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { deleteFriendRequest };
