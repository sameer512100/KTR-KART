const mongoose = require("mongoose");
const { ALLOWED_HOSTELS } = require("../constants/hostels");

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sellerName: { type: String, trim: true, default: "" },
    sellerEmail: { type: String, trim: true, lowercase: true, default: "" },
    sellerHostel: { type: String, trim: true, lowercase: true, default: "" },
    sellerRoomNumber: { type: String, trim: true, default: "" },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 1, min: 0 },
    imageUrl: { type: String, required: true },
    hostel: { type: String, required: true, lowercase: true, enum: ALLOWED_HOSTELS }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual("sellerId").get(function sellerId() {
  if (!this.seller) {
    return "";
  }

  if (typeof this.seller === "string") {
    return this.seller;
  }

  if (this.seller._id) {
    return this.seller._id.toString();
  }

  return this.seller.toString();
});

module.exports = mongoose.model("Product", productSchema);
