const express = require("express");
const metaRoutes = require("./meta.routes");
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const chatRoutes = require("./chat.routes");
const pushRoutes = require("./push.routes");

const router = express.Router();

router.use("/meta", metaRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/chats", chatRoutes);
router.use("/push", pushRoutes);

module.exports = router;
