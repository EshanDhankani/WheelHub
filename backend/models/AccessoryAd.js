const mongoose = require("mongoose");
const AccessoryAdSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    city: String,
    accessoryInfo: String,
    category: String,
    condition: String,
    price: Number,
    accessoryDescription: String,
    mobileNumber: String,
    images: [String],
  },
  { timestamps: true }
);

const AccessoryAdModel = mongoose.model("AccessoryAd", AccessoryAdSchema);
 module.exports = AccessoryAdModel;