const FormDataModel = require("../models/FormData");
const ResetToken = require("../models/ResetPassword");
const crypto = require("crypto");
const transporter = require("../../config/emailConfig");

exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    let user = await FormDataModel.findOne({ email });
    if (user) return res.status(400).json({ message: "Already registered" });

    const token = crypto.randomBytes(32).toString("hex");
    user = await new FormDataModel({
      email,
      password,
      name: `${firstName} ${lastName}`,
      verificationToken: token,
      verified: false,
    }).save();

    // Send Verification Email
    const verifyLink = `http://localhost:5173/verify-email?token=${token}`;
    await transporter.sendMail({
      from: '"WheelHub Support" <eshankumar037@gmail.com>',
      to: email,
      subject: "Verify your email",
      html: `<p>Verify your email by clicking <a href="${verifyLink}">here</a>.</p>`,
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error registering", error: error.message });
  }
};

// Other functions: login, logout, forgot-password, reset-password
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await FormDataModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (user.password !== password) {
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      if (!user.verified) {
        return res.status(403).json({ message: "Email not verified. Please verify your email before logging in." });
      }
  
      req.session.user = user; // Save user session
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
  };
  
  // User Logout
  exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out", error: err.message });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout successful" });
    });
  };
  
  // Forgot Password
  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await FormDataModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const token = crypto.randomBytes(32).toString("hex");
      const resetToken = new ResetToken({ userId: user._id, token });
      await resetToken.save();
  
      const resetLink = `http://localhost:5173/reset-password/${token}`;
      await transporter.sendMail({
        from: '"WheelHub Support" <eshankumar037@gmail.com>',
        to: email,
        subject: "Password Reset Link",
        html: `<p>Reset your password by clicking <a href="${resetLink}">here</a>.</p>`,
      });
  
      res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (error) {
      res.status(500).json({ message: "Error in forgot password", error: error.message });
    }
  };
  
  // Reset Password
  exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
  
    try {
      const resetToken = await ResetToken.findOne({ token });
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
  
      const user = await FormDataModel.findById(resetToken.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.password = password;
      await user.save();
      await ResetToken.deleteOne({ _id: resetToken._id });
  
      res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password", error: error.message });
    }
  };