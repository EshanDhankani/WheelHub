const AccessoryAdModel = require("../models/AccessoryAd");

// Post a new accessory ad
exports.postAccessoryAd = async (req, res) => {
  try {
    const { city, accessoryInfo, category, condition, price, accessoryDescription, mobileNumber } = req.body;
    const images = req.files.map((file) => file.path); // Handle uploaded images

    const newAd = new AccessoryAdModel({
      userId: req.session.user._id,
      city,
      accessoryInfo,
      category,
      condition,
      price,
      accessoryDescription,
      mobileNumber,
      images,
    });

    await newAd.save();
    res.status(201).json({ message: "Accessory ad posted successfully", ad: newAd });
  } catch (error) {
    console.error("Error posting accessory ad:", error.message);
    res.status(500).json({ message: "Error posting accessory ad", error: error.message });
  }
};

// Get all accessory ads
exports.getAccessoryAds = async (req, res) => {
  try {
    const accessories = await AccessoryAdModel.find();
    res.status(200).json(accessories);
  } catch (error) {
    console.error("Error fetching accessory ads:", error.message);
    res.status(500).json({ message: "Error fetching accessory ads", error: error.message });
  }
};

// Get accessory ads posted by the logged-in user
exports.getMyAccessoryAds = async (req, res) => {
  try {
    const accessoryAds = await AccessoryAdModel.find({ userId: req.session.user._id });
    res.status(200).json({ message: "Success", accessoryAds });
  } catch (error) {
    console.error("Error fetching user accessory ads:", error.message);
    res.status(500).json({ message: "Error fetching user accessory ads", error: error.message });
  }
};

// Update an accessory ad
exports.updateAccessoryAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { city, accessoryInfo, category, condition, price, accessoryDescription, mobileNumber } = req.body;

    const images =
      req.files.length > 0
        ? req.files.map((file) => file.path)
        : req.body.images;

    const updatedAd = await AccessoryAdModel.findByIdAndUpdate(
      id,
      {
        city,
        accessoryInfo,
        category,
        condition,
        price,
        accessoryDescription,
        mobileNumber,
        images,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ message: "Accessory ad not found" });
    }

    res.status(200).json({ message: "Accessory ad updated successfully", ad: updatedAd });
  } catch (error) {
    console.error("Error updating accessory ad:", error.message);
    res.status(500).json({ message: "Error updating accessory ad", error: error.message });
  }
};

// Delete an accessory ad
exports.deleteAccessoryAd = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAd = await AccessoryAdModel.findByIdAndDelete(id);
    if (!deletedAd) {
      return res.status(404).json({ message: "Accessory ad not found" });
    }

    res.status(200).json({ message: "Accessory ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting accessory ad:", error.message);
    res.status(500).json({ message: "Error deleting accessory ad", error: error.message });
  }
};
