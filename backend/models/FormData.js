const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    googleId: { type: String, unique: false }, 
    name : String,
    email: { type: String, unique: true, required: true }, 
    password: { type: String, required: false }, 
}, {timestamps: true});

const FormDataModel = mongoose.model('Profile', FormDataSchema);

module.exports = FormDataModel;
