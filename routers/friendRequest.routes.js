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

router.post("/send", auth, sendFriendRequest);
router.get("/sent", auth, getSentRequests);
router.post("/withdraw", auth, withdrawFriendRequest);

module.exports = router;
