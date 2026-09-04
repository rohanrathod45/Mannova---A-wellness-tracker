const Journal = require("../models/Journal");

// ========================================
// Create Journal
// POST /api/journals
// ========================================

const createJournal = async (req, res) => {
    try {

        const { title, content, mood } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        // Create journal using authenticated user's ID
        const journal = await Journal.create({
            userId: req.user.id,
            title,
            content,
            mood
        });

        return res.status(201).json({
            success: true,
            message: "Journal created successfully",
            data: journal
        });

    } catch (error) {

        console.error("Create Journal Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// Get All Journals
// GET /api/journals
// ========================================

const getAllJournals = async (req, res) => {
    try {

        // Only get journals belonging to logged-in user
        const journals = await Journal.find({
            userId: req.user.id
        })
            .populate("userId", "fullName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: journals.length,
            data: journals
        });

    } catch (error) {

        console.error("Get Journals Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// Get Journal By ID
// GET /api/journals/:id
// ========================================

const getJournalById = async (req, res) => {
    try {

        const journal = await Journal.findOne({
            _id: req.params.id,
            userId: req.user.id
        })
            .populate("userId", "fullName email");

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: journal
        });

    } catch (error) {

        console.error("Get Journal Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// Update Journal
// PUT /api/journals/:id
// ========================================

const updateJournal = async (req, res) => {
    try {

        const { title, content, mood } = req.body;

        const journal = await Journal.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                title,
                content,
                mood
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Journal updated successfully",
            data: journal
        });

    } catch (error) {

        console.error("Update Journal Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// Delete Journal
// DELETE /api/journals/:id
// ========================================

const deleteJournal = async (req, res) => {
    try {

        const journal = await Journal.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Journal deleted successfully"
        });

    } catch (error) {

        console.error("Delete Journal Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createJournal,
    getAllJournals,
    getJournalById,
    updateJournal,
    deleteJournal
};