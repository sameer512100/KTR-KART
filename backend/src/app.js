const express = require("express");
const cors = require("cors");
const fs = require("fs");
const routes = require("./routes");
const env = require("./config/env");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.set("trust proxy", 1);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login/signup attempts, please try again after 15 minutes." }
});

const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});

if (!fs.existsSync(env.UPLOADS_DIR)) {
  fs.mkdirSync(env.UPLOADS_DIR, { recursive: true });
}

app.use(cors({
  origin: env.ALLOWED_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(env.UPLOADS_DIR));

app.use("/api/auth", authLimiter);
app.use("/api", generalApiLimiter);
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
