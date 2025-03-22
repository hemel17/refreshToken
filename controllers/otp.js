const createError = require("../utils/error");
const otpService = require("../services/otp");

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw createError("invalid credential", 400);
  }

  try {
    const user = await otpService.verify(email, otp);

    res.status(200).json({
      message: "account verified",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyOtp };
