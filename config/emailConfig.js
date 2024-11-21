const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "eshankumar037@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

module.exports = transporter;
