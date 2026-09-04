const express = require("express");

const router = express.Router();

const {
  completeExercise,
  getCompletedExercises,
  deleteCompletedExercise,
} = require("../controllers/exerciseController");

const authMiddleware = require("../middleware/authMiddleware");

// Complete an exercise
router.post(
  "/",
  authMiddleware,
  completeExercise
);

// Get logged-in user's completed exercises
router.get(
  "/",
  authMiddleware,
  getCompletedExercises
);

// Delete a completed exercise record
router.delete(
  "/:id",
  authMiddleware,
  deleteCompletedExercise
);

module.exports = router;