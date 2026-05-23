const express = require("express");
const cors = require("cors");
const fs = require("fs");
const routes = require("./routes");
const env = require("./config/env");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Set security headers
app.use(helmet());

// Configure Rate Limiters to prevent abuse/brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 25 authentication requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login/signup attempts, please try again after 15 minutes." }
});

const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});

if (!fs.existsSync(env.UPLOADS_DIR)) {
  fs.mkdirSync(env.UPLOADS_DIR, { recursive: true });
}

// Lock CORS to the frontend domain
app.use(cors({
  origin: env.ALLOWED_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(env.UPLOADS_DIR));

// Apply Rate Limiters
app.use("/api/auth", authLimiter);
app.use("/api", generalApiLimiter);
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
