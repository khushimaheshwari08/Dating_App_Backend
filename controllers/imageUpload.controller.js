const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files were uploaded"
      });
    }

    const imageUrls = req.files.map(file => file.path);
    
    res.status(200).json({
      success: true,
      urls: imageUrls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { uploadImage };