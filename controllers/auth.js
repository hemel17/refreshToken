const authService = require("../services/auth");
const createError = require("../utils/error");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw createError("invalid data", 400);
  }

  try {
    const user = await authService.register(name, email, password);
    res.status(201).json({
      success: true,
      message: "otp sent",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError("invalid data", 400);
  }

  try {
    const { token, refreshToken } = await authService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "login successful",
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout(req.user._id);

    res.clearCookie("token");
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "logout successful",
    });
  } catch (error) {
    console.error("logout error", error);
    res.status(500).json({
      message: "an error occurred during logout",
    });
  }
};

module.exports = { register, login, logout };
