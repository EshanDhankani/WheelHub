const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    carAdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarAd",
      required: true,
    },
    message: { type: String, required: true },
    fontColor: { type: String, default: "#000000" }, 
    fontSize: { type: Number, default: 14 }, 
    fontStyle: { type: String, default: "Arial" }, 
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
