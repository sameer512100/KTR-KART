const User = require("../models/User");
const { verifyToken } = require("../services/auth.service");
const { createAndPopulateMessage } = require("../services/chat.service");

const registerChatSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Missing auth token"));
      }

      const payload = verifyToken(token);
      const user = await User.findById(payload.sub);
      if (!user) {
        return next(new Error("Invalid auth token"));
      }

      socket.user = user;
      return next();
    } catch (_error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    socket.join(`user:${userId}`);

    socket.on("chat:send", async (payload) => {
      try {
        const receiverId = payload?.receiverId;
        const text = String(payload?.text || "").trim();
        const productId = payload?.productId;

        if (!receiverId || !text) {
          socket.emit("chat:error", { error: "receiverId and text are required" });
          return;
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
          socket.emit("chat:error", { error: "Receiver not found" });
          return;
        }

        const fullMessage = await createAndPopulateMessage({
          sender: socket.user._id,
          receiver: receiverId,
          text,
          product: productId || undefined
        });

        io.to(`user:${userId}`).emit("chat:message", fullMessage);
        io.to(`user:${receiverId}`).emit("chat:message", fullMessage);
      } catch (_error) {
        socket.emit("chat:error", { error: "Failed to send message" });
      }
    });
  });
};

module.exports = { registerChatSocket };
