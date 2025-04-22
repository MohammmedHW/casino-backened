const express = require("express");
const router = express.Router();
const blogController = require("../controllers/Blog.Controller");
const auth = require("../middlewares/auth");

// Get all blogs
router.get("/", blogController.getAllBlogs);

// Get single blog
router.get("/:id", blogController.getBlogById);

// Create blog (admin only)
router.post("/", auth, blogController.createBlog);

// Update blog (admin only)
router.put("/:id", auth, blogController.updateBlog);

// Delete blog (admin only)
router.delete("/:id", auth, blogController.deleteBlog);

module.exports = router;
