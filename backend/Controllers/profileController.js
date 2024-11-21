const FormDataModel = require("../models/FormData");

exports.getCurrentUser = (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const updatedUser = await FormDataModel.findByIdAndUpdate(
      req.session.user._id,
      { name: `${firstName} ${lastName}`, ...(password && { password }) },
      { new: true, runValidators: true }
    );

    req.session.user = updatedUser; // Update session
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    await FormDataModel.findByIdAndDelete(req.session.user._id);
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};
