const User = require("../models/User");
const createError = require("../utils/error");
const jwtToken = require("../utils/jwtToken");
const userService = require("./user");
const secretKey = process.env.SECRET_KEY;

const register = async (name, email, password) => {
  const user = await userService.findUserByProperty("email", email);

  if (user) {
    throw createError("user already exists", 400);
  }

  return await userService.createNewUser(name, email, password);
};

const login = async (email, password) => {
  const user = await userService.findUserByProperty("email", email);

  if (!user) {
    throw createError("invalid credential", 400);
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw createError("invalid credential", 400);
  }

  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
  };

  const token = await jwtToken.access(payload, secretKey);
  const refreshToken = await jwtToken.refresh(payload, secretKey);

  user.refreshToken = refreshToken;
  await user.save();

  return { token, refreshToken };
};

module.exports = { register, login };
