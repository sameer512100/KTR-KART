const { ALLOWED_HOSTELS } = require("../constants/hostels");

const getHostels = (_req, res) => {
  res.json({ hostels: ALLOWED_HOSTELS });
};

module.exports = { getHostels };
