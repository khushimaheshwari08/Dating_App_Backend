const User = require("../models/user.model");
const Auth = require("../models/auth.model");
const FriendRequest = require("../models/friendRequest.model");

const getReceivedRequests = async (req, res) => {
  try {
    const receiverId = req.user.id;

    const requests = await FriendRequest.find({
      receiver: receiverId,
      status: "pending",
    });

    const enrichedRequests = await Promise.all(
      requests.map(async (req) => {
        const senderAuth = await Auth.findById(req.sender).select("name email");
        const senderProfile = await User.findOne({ userId: req.sender }).select(
          "name email gender birthday image"
        );

        return {
          _id: req._id,
          createdAt: req.createdAt,
          name: senderAuth?.name || null,
          email: senderAuth?.email || null,
          gender: senderProfile?.gender || null,
          birthday: senderProfile?.birthday || null,
          image: senderProfile?.image || null,
        };
      })
    );

    res.status(200).json({ success: true, requests: enrichedRequests });
  } catch (error) {
    console.error("Error in getReceivedRequests:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReceivedRequests };
