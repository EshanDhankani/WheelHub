const mongoose = require("mongoose");

const ResetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Profile' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 3600 }  
  });


  const ResetToken = mongoose.model("ResetToken", ResetTokenSchema);

  module.exports = ResetToken;