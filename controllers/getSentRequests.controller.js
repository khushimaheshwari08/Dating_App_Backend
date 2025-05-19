const FriendRequest = require("../models/friendRequest.model");
const User = require("../models/user.model"); // import your User model

const getSentRequests = async (req, res) => {
  try {
    const senderId = req.user.id;

    // Get pending requests sent by this user
    const requests = await FriendRequest.find({
      sender: senderId,
      status: "pending",
    });

    // Manually fetch receiver user info for each request
    const enrichedRequests = await Promise.all(
      requests.map(async (req) => {
        const receiverInfo = await User.findOne({userId:req.receiver}).select("userId name gender birthday");
        return {
          // ...req.toObject(),
          ...receiverInfo.toObject(),
        };
      })
    );

    res.status(200).json({ success: true, requests: enrichedRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSentRequests };
