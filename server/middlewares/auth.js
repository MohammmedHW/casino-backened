const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // Check if user is admin
    if (!decoded.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
