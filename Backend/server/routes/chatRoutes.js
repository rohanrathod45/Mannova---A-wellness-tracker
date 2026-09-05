const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const {
  chatWithGemini,
} = require("../controllers/chatController");

// Optional auth: attach user if valid token, but don't block guests or expired tokens
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
        } catch (jwtErr) {
          // Expired or invalid token - gracefully continue as guest
          req.user = null;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

router.post(
  "/",
  optionalAuth,
  chatWithGemini
);

module.exports = router;