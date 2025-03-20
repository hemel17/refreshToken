const User = require("../models/User");
const createError = require("../utils/error");
const userService = require("./user");

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

  return user;
};

module.exports = { register, login };
