const mongoose = require("mongoose");

const FormDataSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: false },
    name: String,
    email: { type: String, unique: true, required: true }, 
    password: { type: String, required: false },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
  },
  { timestamps: true }
);


const FormDataModel = mongoose.model("Profile", FormDataSchema);
module.exports = FormDataModel;
