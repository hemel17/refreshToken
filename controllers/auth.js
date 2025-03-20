const authService = require("../services/auth");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      message: "invalid data",
    });
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

module.exports = { register };
