const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth.Controller");
const auth = require("../middlewares/auth");

// Register user (admin only can create new admins)
router.post("/register", auth, authController.register);

// Login user
router.post("/login", authController.login);

// Get current user
router.get("/me", auth, authController.getCurrentUser);

// Admin special route - initialize the first admin user
router.post("/init-admin", authController.initAdmin);

module.exports = router;
