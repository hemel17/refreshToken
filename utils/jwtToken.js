const jwt = require("jsonwebtoken");

const access = (payload, secretKey) => {
  return jwt.sign(payload, secretKey, { expiresIn: "1d" });
};

const refresh = (payload, secretKey) => {
  return jwt.sign(payload, secretKey, { expiresIn: "7d" });
};

module.exports = { access, refresh };
