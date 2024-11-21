const express = require("express");
const { sendMessage, getMessagesByCarAd } = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");
const multerConfig = require("../middlewares/multerConfig");

const router = express.Router();

// Message routes
router.post("/", authMiddleware, multerConfig.single("image"), sendMessage);
router.get("/:carAdId", authMiddleware, getMessagesByCarAd);

module.exports = router;
