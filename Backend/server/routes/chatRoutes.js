const express = require("express");

const router = express.Router();

const {
  chatWithGemini,
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware,
  chatWithGemini
);

module.exports = router;