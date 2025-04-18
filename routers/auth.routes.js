const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const profileController = require("../controllers/profile.controller");

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Profile completion
router.post("/complete-profile", profileController.completeProfile);

module.exports = router;
