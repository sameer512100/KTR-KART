const mongoose = require("mongoose");
const { ALLOWED_HOSTELS } = require("../constants/hostels");

const pendingUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    hostel: { type: String, required: true, lowercase: true, enum: ALLOWED_HOSTELS },
    roomNumber: { type: String, required: true, trim: true },
    otpHash: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PendingUser", pendingUserSchema);
