const User = require("../models/User");
const Message = require("../models/Message");
const { createAndPopulateMessage } = require("../services/chat.service");
const { getIo } = require("../sockets/io");

const getChatUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "name email hostel roomNumber"
    );
    return res.json({ users });
  } catch (_error) {
    return res.status(500).json({ error: "Failed to fetch chat users" });
  }
};

const getMessagesWithUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("product", "title price imageUrl");

    return res.json({ messages });
  } catch (_error) {
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { text, productId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Message text is required" });
    }

    const receiver = await User.findById(userId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const fullMessage = await createAndPopulateMessage({
      sender: req.user._id,
      receiver: userId,
      text: String(text).trim(),
      product: productId || undefined
    });

    const io = getIo();
    if (io) {
      io.to(`user:${req.user._id}`).emit("chat:message", fullMessage);
      io.to(`user:${userId}`).emit("chat:message", fullMessage);
    }

    return res.status(201).json({ message: fullMessage });
  } catch (_error) {
    return res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = {
  getChatUsers,
  getMessagesWithUser,
  sendMessage
};
