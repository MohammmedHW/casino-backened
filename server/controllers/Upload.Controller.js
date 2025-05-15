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
const streamifier = require("streamifier");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.file;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message:
          "Invalid file type. Only JPG, PNG, GIF, and WEBP images are allowed",
      });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res
        .status(400)
        .json({ message: "File size too large. Max 5MB allowed" });
    }

    // Upload to Cloudinary using buffer instead of temp file
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "casino-website",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({
            message: "File upload failed",
            error: error.message,
          });
        }
        res.json({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // Create a stream from the buffer and pipe to Cloudinary
    streamifier.createReadStream(file.data).pipe(uploadStream);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
};
