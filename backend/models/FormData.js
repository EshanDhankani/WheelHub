const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    googleId: String,
    name : String,
    email: String,
    password: String
},{timestamps:true});

const FormDataModel = mongoose.model('Profile', FormDataSchema);

module.exports = FormDataModel;

