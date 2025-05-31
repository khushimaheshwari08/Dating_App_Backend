const express = require("express");
const router = express.Router();

const chatController = require("../controllers/getMutualFriends.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/mutual-friends",
  authMiddleware,
  chatController.getMutualFriendsForChat
);

module.exports = router;
