const FriendRequest = require("../models/friendRequest.model");
const Auth = require("../models/auth.model"); // sender is from Auth collection

const getReceivedRequests = async (req, res) => {
  try {
    const receiverId = req.user.id; // Auth._id

    // Find all pending requests where the current user is the receiver
    const requests = await FriendRequest.find({
      receiver: receiverId,
      status: "pending",
    });

    // Enrich each request with sender info
    const enrichedRequests = await Promise.all(
      requests.map(async (req) => {
        const senderInfo = await Auth.findById(req.sender).select("name email");
        return {
          _id: req._id,
          createdAt: req.createdAt,
          sender: senderInfo || null,
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
