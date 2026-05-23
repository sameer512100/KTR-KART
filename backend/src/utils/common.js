const crypto = require("crypto");

const createOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

const normalizeHostel = (hostel) => (hostel || "").toString().trim().toLowerCase();

const isSrmEmail = (email) => /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/i.test(email || "");

module.exports = {
  createOtp,
  sha256,
  normalizeHostel,
  isSrmEmail
};
