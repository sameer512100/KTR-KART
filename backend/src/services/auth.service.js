const jwt = require("jsonwebtoken");
const env = require("../config/env");

const generateToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      hostel: user.hostel
    },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);

module.exports = {
  generateToken,
  verifyToken
};
