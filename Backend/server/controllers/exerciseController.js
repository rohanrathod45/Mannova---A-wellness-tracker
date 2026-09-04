const Exercise = require("../models/Exercise");

// ========================================
// Complete Exercise
// POST /api/exercises
// ========================================

const completeExercise = async (req, res) => {
  try {
    const {
      exerciseId,
      title,
      category,
      duration,
    } = req.body;

    if (!exerciseId) {
      return res.status(400).json({
        success: false,
        message: "Exercise ID is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Exercise title is required",
      });
    }

    const exercise = await Exercise.create({
      userId: req.user.id,
      exerciseId,
      title,
      category: category || "",
      duration: Number(duration) || 0,
      completedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Exercise completed successfully",
      data: exercise,
    });
  } catch (error) {
    console.error("Complete Exercise Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Get User's Completed Exercises
// GET /api/exercises
// ========================================

const getCompletedExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({
      userId: req.user.id,
    }).sort({
      completedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    console.error("Get Exercises Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Delete Completed Exercise
// DELETE /api/exercises/:id
// ========================================

const deleteCompletedExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exercise record deleted successfully",
    });
  } catch (error) {
    console.error("Delete Exercise Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  completeExercise,
  getCompletedExercises,
  deleteCompletedExercise,
};