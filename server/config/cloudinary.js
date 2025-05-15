// const cloudinary = require("cloudinary").v2;

// exports.cloudinaryConnect = () => {
//   try {
//     cloudinary.config({
//       cloud_name: process.env.CLOUD_NAME,
//       api_key: process.env.API_KEY,
//       api_secret: process.env.API_SECRET,
//     });
//     console.log("Cloudinary connected successfully");
//   } catch (error) {
//     console.log("Cloudinary connection failed");
//     console.error(error);
//   }
// };

const cloudinary = require("cloudinary").v2;

exports.cloudinaryConnect = () => {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary credentials not configured");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    console.log("Cloudinary connected successfully");
  } catch (error) {
    console.error("Cloudinary connection failed:", error.message);
    throw error; // Rethrow to prevent server from starting without Cloudinary
  }
};
