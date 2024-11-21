const express = require("express");
const { postAccessoryAd, getAccessoryAds, updateAccessoryAd, deleteAccessoryAd, getMyAccessoryAds } = require("../controllers/accessoryAdController");
const authMiddleware = require("../middlewares/authMiddleware");
const multerConfig = require("../middlewares/multerConfig");

const router = express.Router();

// Accessory ads routes
router.post("/", authMiddleware, multerConfig.array("images", 3), postAccessoryAd);
router.get("/", getAccessoryAds);
router.get("/myAds", authMiddleware, getMyAccessoryAds);
router.put("/:id", authMiddleware, multerConfig.array("images", 3), updateAccessoryAd);
router.delete("/:id", authMiddleware, deleteAccessoryAd);

module.exports = router;
