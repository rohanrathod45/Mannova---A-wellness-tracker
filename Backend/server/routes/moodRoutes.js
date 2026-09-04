// const express = require("express");
// const authMiddleware = require("../middleware/authMiddleware");

// const router = express.Router();

// const {
//     createMood,
//     getAllMoods,
//     getMoodById,
//     updateMood,
//     deleteMood
// } = require("../controllers/moodController");

// router.post("/", createMood);

// router.get("/", getAllMoods);

// router.get("/:id", getMoodById);

// router.put("/:id", updateMood);

// router.delete("/:id", deleteMood);

// module.exports = router;

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const {
    createMood,
    getAllMoods,
    getMoodById,
    updateMood,
    deleteMood
} = require("../controllers/moodController");


// Create Mood
router.post("/", authMiddleware, createMood);


// Get logged-in user's moods
router.get("/", authMiddleware, getAllMoods);


// Get single mood
router.get("/:id", authMiddleware, getMoodById);


// Update mood
router.put("/:id", authMiddleware, updateMood);


// Delete mood
router.delete("/:id", authMiddleware, deleteMood);


module.exports = router;