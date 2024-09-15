const mongoose = require('mongoose');

const carAdSchema = new mongoose.Schema({
  city: String,
  carInfo: String,
  registeredIn: String,
  exteriorColor: String,
  mileage: Number,
  price: Number,
  adDescription: String,
  mobileNumber: String,
  images: [String],
}, { timestamps: true });

const CarAdModel = mongoose.model('CarAd', carAdSchema);

module.exports = CarAdModel;