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
      message: "user registered successfully",
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

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({
      success: true,
      message: "login successful",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
