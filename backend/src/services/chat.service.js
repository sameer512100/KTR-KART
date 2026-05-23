const Message = require("../models/Message");

const createAndPopulateMessage = async ({ sender, receiver, text, product }) => {
  const message = await Message.create({ sender, receiver, text, product });
  return Message.findById(message._id)
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .populate("product", "title price imageUrl");
};

module.exports = {
  createAndPopulateMessage
};
