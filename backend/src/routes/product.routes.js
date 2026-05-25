const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require("../controllers/product.controller");
const { auth } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/my-listings", auth, getMyProducts);
router.get("/:id", getProductById);
router.post("/", auth, upload.single("image"), createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
