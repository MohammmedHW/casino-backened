const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/Upload.Controller");
const auth = require("../middlewares/auth");

// Upload image - protected by auth middleware
router.post("/image", auth, uploadController.uploadImage);

module.exports = router;
