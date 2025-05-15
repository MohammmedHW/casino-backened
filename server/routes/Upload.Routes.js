// // // const express = require("express");
// // // const router = express.Router();
// // // const uploadController = require("../controllers/Upload.Controller");
// // // const auth = require("../middlewares/auth");

// // // // Upload image - protected by auth middleware
// // // router.post("/image", auth, uploadController.uploadImage);

// // // module.exports = router;

// // const express = require("express");
// // const router = express.Router();
// // const uploadController = require("../controllers/Upload.Controller");
// // const auth = require("../middlewares/auth");
// // const fileUpload = require("express-fileupload");

// // // Apply file upload middleware specifically for this route
// // router.post(
// //   "/image",
// //   auth,
// //   fileUpload({
// //     useTempFiles: false, // We'll handle temp files manually
// //     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
// //     abortOnLimit: true,
// //     responseOnLimit: "File size exceeds the 10MB limit",
// //   }),
// //   uploadController.uploadImage
// // );

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const uploadController = require("../controllers/Upload.Controller");
// const auth = require("../middlewares/auth");
// const fileUpload = require("express-fileupload");

// // Apply file upload middleware specifically for this route
// router.post(
//   "/image",
//   auth,
//   fileUpload({
//     useTempFiles: false, // We'll handle temp files manually in the controller
//     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
//     abortOnLimit: true,
//     responseOnLimit: "File size exceeds the 10MB limit",
//     debug: process.env.NODE_ENV === "development",
//     createParentPath: true, // Ensure parent paths are created
//   }),
//   (req, res, next) => {
//     // Additional logging middleware
//     console.log("Upload route accessed");
//     console.log("Files received:", req.files ? Object.keys(req.files) : "none");
//     next();
//   },
//   uploadController.uploadImage
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/Upload.Controller");
const auth = require("../middlewares/auth");
const fileUpload = require("express-fileupload");
const os = require("os");

// Configure file upload options
const fileUploadOptions = {
  useTempFiles: true,
  tempFileDir: os.tmpdir(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  abortOnLimit: true,
  responseOnLimit: "File size exceeds the 10MB limit",
  debug: process.env.NODE_ENV === "development",
  createParentPath: true,
  safeFileNames: true,
  preserveExtension: true,
};

// Apply file upload middleware specifically for this route
router.post(
  "/image",
  auth,
  fileUpload(fileUploadOptions),
  (req, res, next) => {
    // Log request details
    console.log("------------------------------------");
    console.log("Image upload request received");
    console.log("Request headers:", req.headers["content-type"]);
    console.log(
      "Files present:",
      req.files ? Object.keys(req.files).length : 0
    );
    console.log("------------------------------------");

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message:
          "No image file uploaded or incorrect field name. Use 'image' as the field name.",
      });
    }

    next();
  },
  uploadController.uploadImage
);

module.exports = router;
