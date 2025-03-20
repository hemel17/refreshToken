const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRound = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, saltRound);
  return hash;
};

module.exports = { hashPassword };
