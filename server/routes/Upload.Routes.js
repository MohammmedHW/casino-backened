// const express = require("express");
// const router = express.Router();
// const uploadController = require("../controllers/Upload.Controller");
// const auth = require("../middlewares/auth");

// // Upload image - protected by auth middleware
// router.post("/image", auth, uploadController.uploadImage);

// module.exports = router;

const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/Upload.Controller");
const auth = require("../middlewares/auth");
const fileUpload = require("express-fileupload");

// Apply file upload middleware specifically for this route
router.post(
  "/image",
  auth,
  fileUpload({
    useTempFiles: false, // We'll handle temp files manually
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    abortOnLimit: true,
    responseOnLimit: "File size exceeds the 10MB limit",
  }),
  uploadController.uploadImage
);

module.exports = router;
