// // // const cloudinary = require("cloudinary").v2;

// // // exports.uploadImage = async (req, res) => {
// // //   try {
// // //     if (!req.files || Object.keys(req.files).length === 0) {
// // //       return res.status(400).json({ message: "No file uploaded" });
// // //     }

// // //     const file = req.files.file;

// // //     // Validate file type (optional)
// // //     const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
// // //     if (!allowedTypes.includes(file.mimetype)) {
// // //       return res.status(400).json({
// // //         message: "Invalid file type. Only JPG, PNG and GIF images are allowed",
// // //       });
// // //     }

// // //     // Upload to cloudinary
// // //     const result = await cloudinary.uploader.upload(file.tempFilePath, {
// // //       folder: "casino-website",
// // //       resource_type: "auto",
// // //     });

// // //     res.json({
// // //       url: result.secure_url,
// // //       public_id: result.public_id,
// // //     });
// // //   } catch (error) {
// // //     console.error("Upload error:", error);
// // //     res
// // //       .status(500)
// // //       .json({ message: "File upload failed", error: error.message });
// // //   }
// // // };

// // const cloudinary = require("cloudinary").v2;
// // const fs = require("fs");
// // const path = require("path");

// // // Ensure temp directory exists
// // const tempDir = path.join(__dirname, "../../tmp");
// // if (!fs.existsSync(tempDir)) {
// //   fs.mkdirSync(tempDir, { recursive: true });
// // }

// // exports.uploadImage = async (req, res) => {
// //   try {
// //     if (!req.files || !req.files.image) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "No image file uploaded",
// //       });
// //     }

// //     const image = req.files.image;
// //     const tempFilePath = path.join(tempDir, `${Date.now()}-${image.name}`);

// //     // Save file temporarily
// //     await image.mv(tempFilePath);

// //     // Upload to Cloudinary
// //     const result = await cloudinary.uploader.upload(tempFilePath, {
// //       folder: process.env.CLOUDINARY_FOLDER || "casino-uploads",
// //       resource_type: "auto",
// //       quality: "auto:good",
// //     });

// //     // Clean up temp file
// //     fs.unlinkSync(tempFilePath);

// //     res.status(200).json({
// //       success: true,
// //       message: "Image uploaded successfully",
// //       data: {
// //         url: result.secure_url,
// //         public_id: result.public_id,
// //         width: result.width,
// //         height: result.height,
// //         format: result.format,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Upload error:", error);

// //     // Clean up temp file if it exists
// //     if (tempFilePath && fs.existsSync(tempFilePath)) {
// //       fs.unlinkSync(tempFilePath);
// //     }

// //     res.status(500).json({
// //       success: false,
// //       message: "Image upload failed",
// //       error: process.env.NODE_ENV === "development" ? error.message : undefined,
// //     });
// //   }
// // };

// const cloudinary = require("cloudinary").v2;
// const fs = require("fs");
// const path = require("path");
// const { promisify } = require("util");

// // Promisify fs functions
// const unlinkAsync = promisify(fs.unlink);
// const existsAsync = promisify(fs.exists);
// const mkdirAsync = promisify(fs.mkdir);

// // Ensure temp directory exists - do this synchronously during module load
// const tempDir = path.join(__dirname, "../../tmp");
// if (!fs.existsSync(tempDir)) {
//   try {
//     fs.mkdirSync(tempDir, { recursive: true });
//     console.log(`Created temp directory at ${tempDir}`);
//   } catch (err) {
//     console.error(`Failed to create temp directory: ${err.message}`);
//     // Continue execution, we'll handle this in the upload function
//   }
// }

// exports.uploadImage = async (req, res) => {
//   let tempFilePath = null;

//   try {
//     // Validate request
//     if (!req.files || !req.files.image) {
//       return res.status(400).json({
//         success: false,
//         message: "No image file uploaded",
//       });
//     }

//     const image = req.files.image;

//     // Log information for debugging
//     console.log("Upload request received:", {
//       fileName: image.name,
//       fileSize: image.size,
//       mimeType: image.mimetype,
//     });

//     // Create temp directory if it doesn't exist
//     if (!fs.existsSync(tempDir)) {
//       await mkdirAsync(tempDir, { recursive: true });
//       console.log(`Created temp directory at ${tempDir} (during request)`);
//     }

//     // Generate unique temp file path
//     tempFilePath = path.join(tempDir, `${Date.now()}-${image.name}`);
//     console.log(`Using temp file path: ${tempFilePath}`);

//     // Save file temporarily
//     await image.mv(tempFilePath);
//     console.log("File saved to temp location");

//     // Verify the file exists
//     const fileExists = await existsAsync(tempFilePath);
//     if (!fileExists) {
//       throw new Error(`Failed to save file to temp path: ${tempFilePath}`);
//     }

//     // Upload to Cloudinary
//     console.log("Attempting Cloudinary upload...");
//     const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "casino-uploads";
//     console.log(`Using Cloudinary folder: ${cloudinaryFolder}`);

//     const result = await cloudinary.uploader.upload(tempFilePath, {
//       folder: cloudinaryFolder,
//       resource_type: "auto",
//       quality: "auto:good",
//     });

//     console.log("Cloudinary upload successful:", result.public_id);

//     // Clean up temp file
//     await unlinkAsync(tempFilePath);
//     console.log("Temp file cleaned up");

//     // Return success response
//     return res.status(200).json({
//       success: true,
//       message: "Image uploaded successfully",
//       data: {
//         url: result.secure_url,
//         public_id: result.public_id,
//         width: result.width,
//         height: result.height,
//         format: result.format,
//       },
//     });
//   } catch (error) {
//     console.error("Upload error:", error);

//     // Log detailed information
//     console.error({
//       message: error.message,
//       stack: error.stack,
//       cloudinaryError: error.http_code
//         ? {
//             code: error.http_code,
//             message: error.message,
//           }
//         : "Not a Cloudinary error",
//     });

//     // Clean up temp file if it exists
//     if (tempFilePath) {
//       try {
//         const fileExists = await existsAsync(tempFilePath);
//         if (fileExists) {
//           await unlinkAsync(tempFilePath);
//           console.log("Temp file cleaned up after error");
//         }
//       } catch (cleanupError) {
//         console.error("Error cleaning up temp file:", cleanupError);
//       }
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Image upload failed",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Server error, please try again later",
//     });
//   }
// };

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const os = require("os");

// Use system temp directory instead of custom path
const tempDir = os.tmpdir();
console.log(`Using system temp directory: ${tempDir}`);

exports.uploadImage = async (req, res) => {
  let tempFilePath = null;

  try {
    // Validate request
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const image = req.files.image;

    // Log information for debugging
    console.log("Upload request received:", {
      fileName: image.name,
      fileSize: image.size,
      mimeType: image.mimetype,
      tempFilePath: image.tempFilePath, // This might already exist from express-fileupload
    });

    // IMPORTANT: Check if we already have a temp file from express-fileupload
    if (image.tempFilePath && fs.existsSync(image.tempFilePath)) {
      tempFilePath = image.tempFilePath;
      console.log(
        `Using existing temp file from express-fileupload: ${tempFilePath}`
      );
    } else {
      // Generate unique temp file path in system temp directory
      tempFilePath = path.join(tempDir, `${Date.now()}-${image.name}`);
      console.log(`Creating new temp file: ${tempFilePath}`);

      // Save file temporarily
      await image.mv(tempFilePath);
      console.log("File saved to temp location");
    }

    // Verify temp file exists and has content
    try {
      const stats = fs.statSync(tempFilePath);
      console.log(`Temp file exists with size: ${stats.size} bytes`);
      if (stats.size === 0) {
        throw new Error("Temp file is empty");
      }
    } catch (statError) {
      console.error("Error checking temp file:", statError);
      throw new Error(`Failed to verify temp file: ${statError.message}`);
    }

    // Verify Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Missing Cloudinary credentials");
      throw new Error("Cloudinary not properly configured");
    }

    // Log Cloudinary configuration (without secrets)
    console.log("Cloudinary configuration:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder: process.env.CLOUDINARY_FOLDER || "casino-uploads",
    });

    // Upload to Cloudinary with multiple retries
    let result = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Cloudinary upload attempt ${attempts}/${maxAttempts}`);

        result = await cloudinary.uploader.upload(tempFilePath, {
          folder: process.env.CLOUDINARY_FOLDER || "casino-uploads",
          resource_type: "auto",
          quality: "auto:good",
        });

        console.log("Cloudinary upload successful:", result.public_id);
        break; // Success - exit retry loop
      } catch (cloudinaryError) {
        console.error(
          `Cloudinary upload attempt ${attempts} failed:`,
          cloudinaryError
        );

        if (attempts >= maxAttempts) {
          throw cloudinaryError; // Re-throw if all attempts failed
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Clean up temp file
    try {
      fs.unlinkSync(tempFilePath);
      console.log("Temp file cleaned up");
    } catch (unlinkError) {
      console.error("Error removing temp file:", unlinkError);
      // Continue despite cleanup error
    }

    // Return success response
    return res.status(200).json({
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

    // Log detailed information
    console.error({
      message: error.message,
      stack: error.stack,
      cloudinaryError: error.http_code
        ? {
            code: error.http_code,
            message: error.message,
          }
        : "Not a Cloudinary error",
    });

    // Clean up temp file if it exists
    if (tempFilePath) {
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
          console.log("Temp file cleaned up after error");
        }
      } catch (cleanupError) {
        console.error("Error cleaning up temp file:", cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Image upload failed: " + (error.message || "Unknown error"),
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Server error, please try again later",
    });
  }
};
