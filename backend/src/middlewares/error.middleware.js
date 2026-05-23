const multer = require("multer");

const notFound = (_req, res) => {
  res.status(404).json({ error: "Route not found" });
};

const errorHandler = (error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }

  if (error.message === "Only image uploads are allowed") {
    return res.status(400).json({ error: error.message });
  }

  if (res.headersSent) {
    return;
  }

  return res.status(500).json({ error: "Unexpected server error" });
};

module.exports = {
  notFound,
  errorHandler
};
