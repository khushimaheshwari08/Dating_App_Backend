const { UploadThing } = require("uploadthing");
require("dotenv").config();

const ut = new UploadThing({
  secret: process.env.UPLOADTHING_SECRET,
});

const generateUploadURL = async () => {
  try {
    const { url, key } = await ut.createUploadURL({
      fileTypes: ["image"],
      metadata: {}, // optional metadata
    });
    return { url, key };
  } catch (error) {
    console.error("Error generating upload URL:", error);
    throw error;
  }
};

module.exports = {
  generateUploadURL,
};