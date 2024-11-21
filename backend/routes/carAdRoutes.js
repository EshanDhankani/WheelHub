const express = require("express");
const { postAd, getCarAds, getCarAdById, updateCarAd, deleteCarAd, getMyCarAds } = require("../controllers/carAdController");
const authMiddleware = require("../middlewares/authMiddleware");
const multerConfig = require("../middlewares/multerConfig");

const router = express.Router();

// Car ads routes
router.post("/", authMiddleware, multerConfig.array("images", 3), postAd);
router.get("/", getCarAds);
router.get("/myAds", authMiddleware, getMyCarAds);
router.get("/:id", getCarAdById);
router.put("/:id", authMiddleware, updateCarAd);
router.delete("/:id", authMiddleware, deleteCarAd);

module.exports = router;
