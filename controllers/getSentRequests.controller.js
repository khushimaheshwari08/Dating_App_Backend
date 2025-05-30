const FriendRequest = require("../models/friendRequest.model");
const User = require("../models/user.model");

const getSentRequests = async (req, res) => {
  try {
    const senderId = req.user.id;

    // Get pending friend requests sent by this user
    const requests = await FriendRequest.find({
      sender: senderId,
      status: "pending",
    });

    // Manually fetch receiver user info for each request
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const receiverInfo = await User.findOne({
          userId: request.receiver,
        }).select("userId name gender birthday image");

        if (!receiverInfo) {
          console.warn("Receiver not found for ID:", request.receiver);
          return null; // Skip if receiver user not found
        }

        return {
          requestId: request._id, // include request ID if needed
          ...receiverInfo.toObject(),
        };
      })
    );

    // Filter out null results (where receiver not found)
    const filteredRequests = enrichedRequests.filter(Boolean);

    res.status(200).json({ success: true, requests: filteredRequests });
  } catch (error) {
    console.error("Error in getSentRequests:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSentRequests };
