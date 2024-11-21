const express = require("express");
const { getCurrentUser, updateProfile, deleteProfile } = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Profile routes
router.get("/", authMiddleware, getCurrentUser);
router.put("/", authMiddleware, updateProfile);
router.delete("/", authMiddleware, deleteProfile);

module.exports = router;
