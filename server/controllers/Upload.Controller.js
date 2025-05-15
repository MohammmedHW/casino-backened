// const cloudinary = require("cloudinary").v2;

// exports.uploadImage = async (req, res) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const file = req.files.file;

//     // Validate file type (optional)
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
//     if (!allowedTypes.includes(file.mimetype)) {
//       return res.status(400).json({
//         message: "Invalid file type. Only JPG, PNG and GIF images are allowed",
//       });
//     }

//     // Upload to cloudinary
//     const result = await cloudinary.uploader.upload(file.tempFilePath, {
//       folder: "casino-website",
//       resource_type: "auto",
//     });

//     res.json({
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res
//       .status(500)
//       .json({ message: "File upload failed", error: error.message });
//   }
// };

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Ensure temp directory exists
const tempDir = path.join(__dirname, "../../tmp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const image = req.files.image;
    const tempFilePath = path.join(tempDir, `${Date.now()}-${image.name}`);

    // Save file temporarily
    await image.mv(tempFilePath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: process.env.CLOUDINARY_FOLDER || "casino-uploads",
      resource_type: "auto",
      quality: "auto:good",
    });

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up temp file if it exists
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
