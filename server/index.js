// const express = require("express");
// const app = express();

// const database = require("./config/database.config");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const { cloudinaryConnect } = require("./config/cloudinary");
// const fileUpload = require("express-fileupload");
// const dotenv = require("dotenv");

// dotenv.config();
// const PORT = process.env.PORT || 4000;

// //database connect
// database.connect();
// //middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); //for using postman
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp",
//   })
// );
// // cloudinary connection
// cloudinaryConnect();

// //routes

// //def route

// app.get("/", (req, res) => {
//   return res.json({
//     success: true,
//     message: "Your server is up and running....",
//   });
// });

// app.listen(PORT, () => {
//   console.log(`App is running at ${PORT}`);
// });

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

// Database connect
database.connect();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5000",
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

// Routes
app.use("/api/casinos", casinoRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Casino Website API is running...",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
