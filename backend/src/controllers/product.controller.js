const Product = require("../models/Product");
const { ALLOWED_HOSTELS } = require("../constants/hostels");
const { normalizeHostel } = require("../utils/common");

const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, hostel, image, quantity } = req.body;
    const normalizedHostel = normalizeHostel(hostel || req.user.hostel);

    if (!title || !category || !price) {
      return res.status(400).json({ error: "title, category, and price are required" });
    }

    if (!ALLOWED_HOSTELS.includes(normalizedHostel)) {
      return res.status(400).json({ error: "Invalid hostel" });
    }

    if (!image) {
      return res.status(400).json({ error: "Product image is required" });
    }

    const product = await Product.create({
      seller: req.user._id,
      title,
      description,
      category,
      price: Number(price),
      quantity: Number(quantity || 1),
      imageUrl: image,
      hostel: normalizedHostel
    });

    return res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create product" });
  }
};

const getProducts = async (req, res) => {
  try {
    const hostel = normalizeHostel(req.query.hostel);
    const query = hostel ? { hostel } : {};

    if (hostel && !ALLOWED_HOSTELS.includes(hostel)) {
      return res.status(400).json({ error: "Invalid hostel" });
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .populate("seller", "name email hostel roomNumber");

    return res.json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email hostel roomNumber"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { title, description, category, price, hostel, quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to edit this listing" });
    }

    if (title) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (category) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (quantity !== undefined) product.quantity = Number(quantity);
    if (hostel) {
      const normalizedHostel = normalizeHostel(hostel);
      if (ALLOWED_HOSTELS.includes(normalizedHostel)) {
        product.hostel = normalizedHostel;
      }
    }

    await product.save();
    return res.json({ message: "Listing updated successfully", product });
  } catch (error) {
    console.error("Error updating listing:", error);
    return res.status(500).json({ error: "Failed to update product listing" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this listing" });
    }

    await Product.deleteOne({ _id: product._id });
    return res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return res.status(500).json({ error: "Failed to delete product listing" });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    return res.json({ products });
  } catch (error) {
    console.error("Error fetching my products:", error);
    return res.status(500).json({ error: "Failed to fetch your listings" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts
};
