const { createRouteHandler } = require("uploadthing/express");
require("dotenv").config();

const uploadService = createRouteHandler({
  router: {
    imageUploader: {
      input: () => true,
      middleware: async () => ({}),
      onUploadComplete: async ({ metadata, file }) => {
        console.log("✅ Upload complete:", file);
      },
    },
  },
  config: {
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});

const generateUploadURL = async () => {
  const { createUploadThing } = await uploadService;
  const { url, key } = await createUploadThing("imageUploader", {});
  return { url, key };
};

module.exports = {
  generateUploadURL,
};
