const express = require("express");
const metaRoutes = require("./meta.routes");
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const chatRoutes = require("./chat.routes");

const router = express.Router();

router.use("/meta", metaRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/chats", chatRoutes);

module.exports = router;
