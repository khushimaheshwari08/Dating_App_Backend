const { generateUploadURL } = require("../services/imageUpload.service");

const createUploadUrlController = async (req, res) => {
  try {
    const { url, key } = await generateUploadURL();
    res.status(200).json({ url, key });
  } catch (error) {
    console.error("❌ Failed to create upload URL:", error);
    res.status(500).json({ error: "Failed to create upload URL" });
  }
};

module.exports = {
  createUploadUrlController,
};
