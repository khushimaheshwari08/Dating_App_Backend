const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  sendFriendRequest,
} = require("../controllers/sendFriendRequest.controller");
const {
  getSentRequests,
} = require("../controllers/getSentRequests.controller");
const {
  withdrawFriendRequest,
} = require("../controllers/withdrawFriendRequest.controller");
const {
  getReceivedRequests,
} = require("../controllers/getReceivedRequests.controller");
const {
  acceptFriendRequest,
} = require("../controllers/acceptFriendRequest.controller");
const {
  deleteFriendRequest,
} = require("../controllers/deleteFriendRequest.controller");

router.post("/send", auth, sendFriendRequest);
router.get("/sent", auth, getSentRequests);
router.post("/withdraw", auth, withdrawFriendRequest);
router.get("/received", auth, getReceivedRequests);
router.post("/accept", auth, acceptFriendRequest);
router.post("/reject", auth, deleteFriendRequest);

module.exports = router;
