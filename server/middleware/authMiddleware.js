const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - JWT verification
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET 
      );

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      next();
    } catch (error) {
      console.error("JWT Verification error:", error.message);
      res.status(401).json({ message: "Not authorized, token invalid or expired" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Admin middleware - check role
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

// Optional authentication middleware
const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (token && !token.startsWith("mock_jwt_token")) {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );
        req.user = await User.findById(decoded.id).select("-password");
      }
    } catch (error) {
      console.warn("Optional auth token invalid:", error.message);
    }
  }

  next();
};

module.exports = { protect, admin, optionalProtect };
