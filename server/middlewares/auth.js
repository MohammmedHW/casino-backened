// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   // Get token from header
//   const token = req.header("x-auth-token");
//   // Check if no token
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }
//   // Verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

//     // Check if user is admin
//     if (!decoded.user.isAdmin) {
//       return res.status(403).json({ message: "Access denied. Admin only." });
//     }

//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization denied: No token provided",
    });
  }

  // Verify token
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret not configured");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      clockTolerance: 30, // 30 seconds tolerance for clock skew
    });

    // Attach user to request
    req.user = decoded.user;

    // Only check admin status for admin routes
    if (req.path.startsWith("/admin") && !decoded.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin privileges required",
      });
    }

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({
      success: false,
      message: "Invalid token",
      ...(process.env.NODE_ENV === "development" && {
        debug: err.message,
      }),
    });
  }
};
