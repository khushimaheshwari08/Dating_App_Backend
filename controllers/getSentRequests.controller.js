const FriendRequest = require("../models/friendRequest.model");
const getSentRequests = async (req, res) => {
  try {
    const senderId = req.user.id;
    const requests = await FriendRequest.find({
      sender: senderId,
      status: "pending",
    });

    console.log("rew", requests);
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { getSentRequests };
