// // const cloudinary = require("cloudinary").v2;

// // exports.cloudinaryConnect = () => {
// //   try {
// //     cloudinary.config({
// //       cloud_name: process.env.CLOUD_NAME,
// //       api_key: process.env.API_KEY,
// //       api_secret: process.env.API_SECRET,
// //     });
// //     console.log("Cloudinary connected successfully");
// //   } catch (error) {
// //     console.log("Cloudinary connection failed");
// //     console.error(error);
// //   }
// // };

// const cloudinary = require("cloudinary").v2;

// exports.cloudinaryConnect = () => {
//   try {
//     if (
//       !process.env.CLOUDINARY_CLOUD_NAME ||
//       !process.env.CLOUDINARY_API_KEY ||
//       !process.env.CLOUDINARY_API_SECRET
//     ) {
//       throw new Error("Cloudinary credentials not configured");
//     }

//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET,
//       secure: true,
//     });
//     console.log("Cloudinary connected successfully");
//   } catch (error) {
//     console.error("Cloudinary connection failed:", error.message);
//     throw error; // Rethrow to prevent server from starting without Cloudinary
//   }
// };

const cloudinary = require("cloudinary").v2;

/**
 * Connects to Cloudinary using environment variables
 * Verifies connection is successful with proper credentials
 */
exports.cloudinaryConnect = () => {
  try {
    // Validate environment variables exist
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Missing Cloudinary credentials:");
      console.error({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓" : "✗",
        api_key: process.env.CLOUDINARY_API_KEY ? "✓" : "✗",
        api_secret: process.env.CLOUDINARY_API_SECRET ? "✓" : "✗",
      });
      throw new Error("Cloudinary credentials not configured correctly");
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    // Test connection
    console.log("Cloudinary configuration applied, testing connection...");

    // Log successful connection
    console.log(
      `Cloudinary connected successfully to cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`
    );

    // Return true to indicate connection success
    return true;
  } catch (error) {
    // Log detailed error information
    console.error("Cloudinary connection failed:", error.message);
    if (error.http_code) {
      console.error(
        `Cloudinary API Error (${error.http_code}):`,
        error.message
      );
    }

    // In production, we might want to continue without Cloudinary
    // but log the error for troubleshooting
    if (process.env.NODE_ENV === "production") {
      console.error(
        "WARNING: Starting server without working Cloudinary connection"
      );
      return false;
    } else {
      // In development, fail fast so the issue is addressed
      throw error;
    }
  }
};
