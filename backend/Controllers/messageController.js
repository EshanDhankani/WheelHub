const MessageModel = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { carAdId, receiverId, message, fontColor, fontSize, fontStyle } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newMessage = new MessageModel({
      senderId: req.session.user._id,
      receiverId,
      carAdId,
      message,
      fontColor,
      fontSize,
      fontStyle,
      imageUrl,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

exports.getMessagesByCarAd = async (req, res) => {
  try {
    const messages = await MessageModel.find({ carAdId: req.params.carAdId }).populate("senderId", "name email").populate("receiverId", "name email");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};
