const mongoose = require("mongoose");

const CarAdSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    city: String,
    carInfo: String,
    year: { type: Number},
    registeredIn: String,
    exteriorColor: String,
    mileage: String,
    price: Number,
    adDescription: String,
    mobileNumber: String,
    images: [String],
  },
  { timestamps: true }
);

const CarAdModel = mongoose.model("CarAd", CarAdSchema);
module.exports = CarAdModel;
