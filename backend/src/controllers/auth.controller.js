const bcrypt = require("bcryptjs");
const User = require("../models/User");
const PendingUser = require("../models/PendingUser");
const { ALLOWED_HOSTELS } = require("../constants/hostels");
const { createOtp, isSrmEmail, normalizeHostel, sha256 } = require("../utils/common");
const { sendOtpEmail, EmailDeliveryError } = require("../services/email.service");
const { generateToken } = require("../services/auth.service");

const initiateSignup = async (req, res) => {
  try {
    const { name, email, password, hostel, roomNumber } = req.body;
    const normalizedEmail = (email || "").toString().trim().toLowerCase();
    const normalizedHostel = normalizeHostel(hostel);

    if (!name || !normalizedEmail || !password || !normalizedHostel || !roomNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!isSrmEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Only @srmist.edu.in emails are allowed" });
    }

    if (!ALLOWED_HOSTELS.includes(normalizedHostel)) {
      return res.status(400).json({ error: "Invalid hostel" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const otp = createOtp();
    const passwordHash = await bcrypt.hash(password, 10);

    await PendingUser.findOneAndUpdate(
      { email: normalizedEmail },
      {
        name,
        email: normalizedEmail,
        passwordHash,
        hostel: normalizedHostel,
        roomNumber,
        otpHash: sha256(otp),
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    await sendOtpEmail(normalizedEmail, otp);
    return res.json({ message: "OTP sent to your SRM email" });
  } catch (error) {
    console.error(error);
    if (error instanceof EmailDeliveryError) {
      return res.status(502).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to initiate signup" });
  }
};

const verifySignup = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = (email || "").toString().trim().toLowerCase();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const pending = await PendingUser.findOne({ email: normalizedEmail });
    if (!pending) {
      return res.status(404).json({ error: "No pending signup found" });
    }

    if (pending.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (sha256(String(otp)) !== pending.otpHash) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      passwordHash: pending.passwordHash,
      hostel: pending.hostel,
      roomNumber: pending.roomNumber
    });

    await PendingUser.deleteOne({ _id: pending._id });

    const token = generateToken(user);
    return res.status(201).json({
      message: "Signup complete",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hostel: user.hostel,
        roomNumber: user.roomNumber,
        profilePhoto: user.profilePhoto || ""
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to verify signup" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").toString().trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hostel: user.hostel,
        roomNumber: user.roomNumber,
        profilePhoto: user.profilePhoto || ""
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to sign in" });
  }
};

const me = (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      hostel: req.user.hostel,
      roomNumber: req.user.roomNumber,
      profilePhoto: req.user.profilePhoto || ""
    }
  });
};

const updateProfile = async (req, res) => {
  try {
    const { name, hostel, roomNumber, profilePhoto } = req.body;

    if (!name || !hostel || !roomNumber) {
      return res.status(400).json({ error: "Name, hostel, and room number are required" });
    }

    const normalizedHostel = normalizeHostel(hostel);
    if (!ALLOWED_HOSTELS.includes(normalizedHostel)) {
      return res.status(400).json({ error: "Invalid hostel" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        hostel: normalizedHostel,
        roomNumber,
        profilePhoto: profilePhoto !== undefined ? profilePhoto : req.user.profilePhoto || ""
      },
      { returnDocument: "after" }
    );

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        hostel: updatedUser.hostel,
        roomNumber: updatedUser.roomNumber,
        profilePhoto: updatedUser.profilePhoto || ""
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = {
  initiateSignup,
  verifySignup,
  signin,
  me,
  updateProfile
};
