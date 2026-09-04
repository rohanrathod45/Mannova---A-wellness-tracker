const express = require("express");

const router = express.Router();

const {
    createUser,
    getAllUsers,
} = require("../controllers/userController");

// Create User
router.post("/", createUser);

// Get All Users
router.get("/", getAllUsers);

module.exports = router;