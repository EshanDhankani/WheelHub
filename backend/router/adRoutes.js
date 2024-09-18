const express = require("express");
const multer = require("multer");
const path = require("path");
const CarAdModel = require("./models/CarAd");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/postAd", upload.array("images", 3), async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to post an ad." });
  }

  try {
    const {
      city,
      carInfo,
      registeredIn,
      exteriorColor,
      mileage,
      price,
      adDescription,
      mobileNumber,
    } = req.body;
    const images = req.files.map((file) => file.path);

    const newAd = new CarAdModel({
      userId: req.user._id,
      city,
      carInfo,
      registeredIn,
      exteriorColor,
      mileage,
      price,
      adDescription,
      mobileNumber,
      images,
    });

    await newAd.save();
    res.status(201).json({ message: "Ad posted successfully", ad: newAd });
  } catch (error) {
    console.error("Error posting ad:", error);
    res.status(500).json({ message: "Error posting ad", error: error.message });
  }
});

module.exports = router;
