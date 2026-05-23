const express = require("express");
const {
  getChatUsers,
  getMessagesWithUser,
  sendMessage
} = require("../controllers/chat.controller");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/users", auth, getChatUsers);
router.get("/:userId", auth, getMessagesWithUser);
router.post("/:userId", auth, sendMessage);

module.exports = router;
