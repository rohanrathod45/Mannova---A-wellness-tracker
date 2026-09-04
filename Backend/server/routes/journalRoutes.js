// const express = require("express");

// const router = express.Router();

// const {
//     createJournal,
//     getAllJournals,
//     getJournalById,
//     updateJournal,
//     deleteJournal,
// } = require("../controllers/journalController");

// router.post("/", createJournal);
// router.get("/", getAllJournals);
// router.get("/:id", getJournalById);
// router.put("/:id", updateJournal);
// router.delete("/:id", deleteJournal);

// module.exports = router;

const express = require("express");

const router = express.Router();

const {
    createJournal,
    getAllJournals,
    getJournalById,
    updateJournal,
    deleteJournal
} = require("../controllers/journalController");

const authMiddleware = require("../middleware/authMiddleware");


// Create Journal
router.post(
    "/",
    authMiddleware,
    createJournal
);


// Get logged-in user's journals
router.get(
    "/",
    authMiddleware,
    getAllJournals
);


// Get single journal
router.get(
    "/:id",
    authMiddleware,
    getJournalById
);


// Update journal
router.put(
    "/:id",
    authMiddleware,
    updateJournal
);


// Delete journal
router.delete(
    "/:id",
    authMiddleware,
    deleteJournal
);


module.exports = router;