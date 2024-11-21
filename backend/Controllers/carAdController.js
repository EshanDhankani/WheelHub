const CarAdModel = require("../models/CarAd");

exports.postAd = async (req, res) => {
  try {
    const { city, carInfo, year, registeredIn, exteriorColor, mileage, price, adDescription, mobileNumber } = req.body;
    const images = req.files.map((file) => file.path);

    const newAd = new CarAdModel({
      userId: req.session.user._id,
      city,
      carInfo,
      year,
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
    res.status(500).json({ message: "Error posting ad", error: error.message });
  }
};

exports.getCarAds = async (req, res) => {
  try {
    const carAds = await CarAdModel.find();
    res.json(carAds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ads", error: error.message });
  }
};

exports.getCarAdById = async (req, res) => {
  try {
    const carAd = await CarAdModel.findById(req.params.id);
    if (!carAd) return res.status(404).json({ message: "Car ad not found" });

    res.json(carAd);
  } catch (error) {
    res.status(500).json({ message: "Error fetching car ad", error: error.message });
  }
};

exports.updateCarAd = async (req, res) => {
  try {
    const updatedAd = await CarAdModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedAd);
  } catch (error) {
    res.status(500).json({ message: "Error updating car ad", error: error.message });
  }
};

exports.deleteCarAd = async (req, res) => {
  try {
    const deletedAd = await CarAdModel.findByIdAndDelete(req.params.id);
    if (!deletedAd) return res.status(404).json({ message: "Car ad not found" });

    res.json({ message: "Car ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car ad", error: error.message });
  }
};

exports.getMyCarAds = async (req, res) => {
  try {
    const carAds = await CarAdModel.find({ userId: req.session.user._id });
    res.json(carAds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching my ads", error: error.message });
  }
};
