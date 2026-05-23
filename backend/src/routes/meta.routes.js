const express = require("express");
const { getHostels } = require("../controllers/meta.controller");

const router = express.Router();

router.get("/hostels", getHostels);

module.exports = router;
