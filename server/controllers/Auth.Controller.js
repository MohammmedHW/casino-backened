const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.Model");

// Register new admin
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create new user
    user = new User({
      email,
      password,
      name,
      isAdmin: true,
    });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login user
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     // Generate JWT token
//     const payload = {
//       user: {
//         id: user.id,
//         isAdmin: user.isAdmin,
//       },
//     };
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET || "secret",
//       { expiresIn: "7d" },
//       (err, token) => {
//         if (err) throw err;
//         res.json({
//           token,
//           user: {
//             id: user.id,
//             email: user.email,
//             isAdmin: user.isAdmin,
//             name: user.name,
//           },
//         });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

// ... (keep existing code)

//updates
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//         isAdmin: user.isAdmin,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET || "secret",
//       { expiresIn: "7d" },
//       (err, token) => {
//         if (err) throw err;
//         res.json({
//           token,
//           user: {
//             id: user.id,
//             email: user.email,
//             isAdmin: user.isAdmin,
//             name: user.name,
//           },
//           redirectTo: "/dashboard", // Add redirect information
//         });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d",
    });

    // Don't send password back
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Initialize first admin
exports.initAdmin = async (req, res) => {
  try {
    // Check if any admin exists
    const adminExists = await User.findOne({ isAdmin: true });

    if (adminExists) {
      return res.status(400).json({ message: "Admin already initialized" });
    }

    // Create default admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin", salt);

    const admin = new User({
      email: "admin@gmail.com",
      password: hashedPassword,
      name: "Admin",
      isAdmin: true,
    });

    await admin.save();
    res.status(201).json({ message: "Admin initialized successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
