// const express = require("express");
// const router = express.Router();
// const authController = require("../controllers/auth.controller");
// const profileController = require("../controllers/profile.controller");
// const userController = require("../controllers/user.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

// // Auth routes
// router.post("/register", authController.register);
// router.post("/login", authController.login);

// // Profile completion
// router.post("/complete-profile", profileController.completeProfile);

// // User routes
// router.get("/others", authMiddleware, userController.getOtherUsers);

// module.exports = router;
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const profileController = require("../controllers/profile.controller");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const parser = require("../middlewares/upload.middleware"); // ✅ Multer Cloudinary uploader

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Profile completion with image upload
router.post(
  "/complete-profile",
  parser.array("image", 5), // ✅ Accept image field
  profileController.completeProfile // ✅ Controller must be exported properly
);

// Get users (excluding liked/requested/etc)
router.get("/others", authMiddleware, userController.getOtherUsers);

module.exports = router;
