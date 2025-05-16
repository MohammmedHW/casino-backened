const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
