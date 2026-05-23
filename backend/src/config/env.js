const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

if (!JWT_SECRET || JWT_SECRET === "change_this_secret_in_env") {
  console.error("CRITICAL ERROR: JWT_SECRET environment variable is missing or insecure! Server startup aborted.");
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error("CRITICAL ERROR: MONGODB_URI environment variable is missing! Server startup aborted.");
  process.exit(1);
}

let ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
if (ALLOWED_ORIGIN.endsWith("/")) {
  ALLOWED_ORIGIN = ALLOWED_ORIGIN.slice(0, -1);
}

const env = {
  PORT: Number(process.env.PORT || 5000),
  MONGODB_URI,
  JWT_SECRET,
  ALLOWED_ORIGIN,
  UPLOADS_DIR: path.join(process.cwd(), "uploads")
};

module.exports = env;
