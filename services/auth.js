const createError = require("../utils/error");
const jwtToken = require("../utils/jwtToken");
const userService = require("./user");
const emailService = require("./email");
const secretKey = process.env.SECRET_KEY;

const register = async (name, email, password) => {
  const user = await userService.findUserByProperty("email", email);

  if (user) {
    throw createError("user already exists", 400);
  }

  const newUser = await userService.createNewUser(name, email, password);

  const otp = await newUser.generateOtp();

  await newUser.save();

  await emailService.sendEmail(
    email,
    "Verification Code",
    otp,
    "verify your email address"
  );

  return newUser;
};

const login = async (email, password) => {
  const user = await userService.findUserByProperty("email", email, true);

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
    role: user.role,
  };

  const token = await jwtToken.access(payload, secretKey);
  const refreshToken = await jwtToken.refresh(payload, secretKey);

  user.refreshToken = refreshToken;
  await user.save();

  return { token, refreshToken };
};

const logout = async (userId) => {
  const user = await userService.findUserByProperty("_id", userId);

  user.refreshToken = null;
  await user.save();
};

const forgotPassword = async (email) => {
  const user = await userService.findUserByProperty("email", email, true);

  if (!user) {
    throw createError("invalid email address", 404);
  }

  const otp = await user.generateForgotPasswordOtp();
  await user.save({ validateBeforeSave: false });

  await emailService.sendEmail(
    email,
    "Reset Password Code",
    otp,
    "change your password"
  );
};

module.exports = { register, login, logout, forgotPassword };
