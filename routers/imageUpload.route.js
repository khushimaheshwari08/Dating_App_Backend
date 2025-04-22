const express = require("express");
const router = express.Router();
const { createUploadUrlController } = require("../controllers/imageUpload.controller");

// POST /api/upload/generate-url
router.post("/imageUpload", createUploadUrlController);

module.exports = router;