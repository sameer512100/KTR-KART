const Message = require("../models/Message");
const { sendPushToUser } = require("./push.service");

const createAndPopulateMessage = async ({ sender, receiver, text, product }) => {
  const message = await Message.create({ sender, receiver, text, product });
  const populated = await Message.findById(message._id)
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .populate("product", "title price imageUrl");

  // fire-and-forget push delivery
  try {
    const payload = {
      type: "chat:message",
      title: populated.sender.name,
      body: populated.text || "New message",
      data: { messageId: String(populated._id), senderId: String(populated.sender._id), product: populated.product || null }
    };
    // don't await; keep it best-effort
    sendPushToUser(receiver, payload).catch(() => {});
  } catch (e) {}

  return populated;
};

module.exports = {
  createAndPopulateMessage
};
