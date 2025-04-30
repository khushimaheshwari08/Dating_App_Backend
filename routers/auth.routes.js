const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const profileController = require("../controllers/profile.controller");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Profile completion
router.post("/complete-profile", profileController.completeProfile);

// User routes
router.get("/others", authMiddleware, userController.getOtherUsers);

module.exports = router;
