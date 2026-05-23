const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const env = require("../config/env");

if (!fs.existsSync(env.UPLOADS_DIR)) {
  fs.mkdirSync(env.UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    return cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { upload };
