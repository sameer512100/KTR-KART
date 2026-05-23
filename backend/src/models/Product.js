const mongoose = require("mongoose");
const { ALLOWED_HOSTELS } = require("../constants/hostels");

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 1, min: 0 },
    imageUrl: { type: String, required: true },
    hostel: { type: String, required: true, lowercase: true, enum: ALLOWED_HOSTELS }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
