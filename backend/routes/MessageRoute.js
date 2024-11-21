const express = require("express");
const { sendMessage, getMessagesByCarAdId } = require("../Controllers/messageController");

const router = express.Router();

router.post("/", sendMessage);
router.get("/:carAdId", getMessagesByCarAdId);

module.exports = router;
