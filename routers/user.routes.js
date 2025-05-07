// routers/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const likeController = require("../controllers/like.controller");
// Get all users except current user
router.get("/others", authMiddleware, userController.getOtherUsers);
router.post("/like", authMiddleware, likeController.likeUser);
module.exports = router;
