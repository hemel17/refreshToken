const createError = require("../utils/error");
const otpService = require("../services/otp");

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw createError("invalid data", 400);
  }

  try {
    const { user, token, refreshToken } = await otpService.verify(email, otp);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({
      message: "account verified",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyOtp };
