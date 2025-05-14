const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Config
dotenv.config();
const PORT = process.env.PORT || 4000;

// Import configs
const database = require("./config/database.config");
const { cloudinaryConnect } = require("./config/cloudinary");

// Import Routes
const casinoRoutes = require("./routes/Casino.Routes");
const blogRoutes = require("./routes/Blogs.Routes");
const authRoutes = require("./routes/Auth.Routes");
const uploadRoutes = require("./routes/Upload.Routes");

// Database connect
database.connect();

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://casino-app-rho-vert.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Cloudinary connection
cloudinaryConnect();

// API Routes
app.use("/api/casinos", casinoRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Casino Backend API",
    version: "1.0.0",
    endpoints: {
      casinos: "/api/casinos",
      blogs: "/api/blogs",
      auth: "/api/auth",
      upload: "/api/upload",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
