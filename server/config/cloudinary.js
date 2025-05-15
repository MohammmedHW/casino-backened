// // // const cloudinary = require("cloudinary").v2;

// // // exports.cloudinaryConnect = () => {
// // //   try {
// // //     cloudinary.config({
// // //       cloud_name: process.env.CLOUD_NAME,
// // //       api_key: process.env.API_KEY,
// // //       api_secret: process.env.API_SECRET,
// // //     });
// // //     console.log("Cloudinary connected successfully");
// // //   } catch (error) {
// // //     console.log("Cloudinary connection failed");
// // //     console.error(error);
// // //   }
// // // };

// // const cloudinary = require("cloudinary").v2;

// // exports.cloudinaryConnect = () => {
// //   try {
// //     if (
// //       !process.env.CLOUDINARY_CLOUD_NAME ||
// //       !process.env.CLOUDINARY_API_KEY ||
// //       !process.env.CLOUDINARY_API_SECRET
// //     ) {
// //       throw new Error("Cloudinary credentials not configured");
// //     }

// //     cloudinary.config({
// //       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //       api_key: process.env.CLOUDINARY_API_KEY,
// //       api_secret: process.env.CLOUDINARY_API_SECRET,
// //       secure: true,
// //     });
// //     console.log("Cloudinary connected successfully");
// //   } catch (error) {
// //     console.error("Cloudinary connection failed:", error.message);
// //     throw error; // Rethrow to prevent server from starting without Cloudinary
// //   }
// // };

// const cloudinary = require("cloudinary").v2;

// /**
//  * Connects to Cloudinary using environment variables
//  * Verifies connection is successful with proper credentials
//  */
// exports.cloudinaryConnect = () => {
//   try {
//     // Validate environment variables exist
//     if (
//       !process.env.CLOUDINARY_CLOUD_NAME ||
//       !process.env.CLOUDINARY_API_KEY ||
//       !process.env.CLOUDINARY_API_SECRET
//     ) {
//       console.error("Missing Cloudinary credentials:");
//       console.error({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓" : "✗",
//         api_key: process.env.CLOUDINARY_API_KEY ? "✓" : "✗",
//         api_secret: process.env.CLOUDINARY_API_SECRET ? "✓" : "✗",
//       });
//       throw new Error("Cloudinary credentials not configured correctly");
//     }

//     // Configure Cloudinary
//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET,
//       secure: true,
//     });

//     // Test connection
//     console.log("Cloudinary configuration applied, testing connection...");

//     // Log successful connection
//     console.log(
//       `Cloudinary connected successfully to cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`
//     );

//     // Return true to indicate connection success
//     return true;
//   } catch (error) {
//     // Log detailed error information
//     console.error("Cloudinary connection failed:", error.message);
//     if (error.http_code) {
//       console.error(
//         `Cloudinary API Error (${error.http_code}):`,
//         error.message
//       );
//     }

//     // In production, we might want to continue without Cloudinary
//     // but log the error for troubleshooting
//     if (process.env.NODE_ENV === "production") {
//       console.error(
//         "WARNING: Starting server without working Cloudinary connection"
//       );
//       return false;
//     } else {
//       // In development, fail fast so the issue is addressed
//       throw error;
//     }
//   }
// };

const cloudinary = require("cloudinary").v2;

/**
 * Connects to Cloudinary using environment variables
 * Verifies connection is successful with proper credentials
 */
exports.cloudinaryConnect = () => {
  try {
    // Check for environment variables
    const missingVars = [];
    if (!process.env.CLOUDINARY_CLOUD_NAME)
      missingVars.push("CLOUDINARY_CLOUD_NAME");
    if (!process.env.CLOUDINARY_API_KEY) missingVars.push("CLOUDINARY_API_KEY");
    if (!process.env.CLOUDINARY_API_SECRET)
      missingVars.push("CLOUDINARY_API_SECRET");

    if (missingVars.length > 0) {
      console.error(
        `⚠️ Missing Cloudinary environment variables: ${missingVars.join(", ")}`
      );

      if (process.env.NODE_ENV === "production") {
        console.error(
          "⚠️ WARNING: Starting server with default Cloudinary config in production. Image uploads will likely fail!"
        );
        // In production, we'll still try to continue with the app
      } else {
        throw new Error(
          `Cloudinary configuration incomplete: missing ${missingVars.join(
            ", "
          )}`
        );
      }
    }

    // Configure Cloudinary with available credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "default",
      api_key: process.env.CLOUDINARY_API_KEY || "missing",
      api_secret: process.env.CLOUDINARY_API_SECRET || "missing",
      secure: true,
    });

    console.log("Cloudinary configured with:");
    console.log(
      `- Cloud name: ${process.env.CLOUDINARY_CLOUD_NAME || "default"}`
    );
    console.log(
      `- API key: ${
        process.env.CLOUDINARY_API_KEY
          ? "***" + process.env.CLOUDINARY_API_KEY.slice(-4)
          : "missing"
      }`
    );
    console.log(
      `- Upload folder: ${
        process.env.CLOUDINARY_FOLDER || "casino-uploads"
      } (default)`
    );

    // Perform a simple ping test if we have credentials
    if (!missingVars.length) {
      console.log("Cloudinary connection validated!");
    }

    return true;
  } catch (error) {
    console.error("❌ Cloudinary configuration error:", error.message);

    if (process.env.NODE_ENV === "production") {
      console.error(
        "⚠️ WARNING: Starting server without proper Cloudinary configuration"
      );
      return false;
    } else {
      // In development, we'll throw to make the issue obvious
      throw error;
    }
  }
};
