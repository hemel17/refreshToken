const createError = require("../utils/error");
const { findUserByProperty } = require("./user");
const jwtToken = require("../utils/jwtToken");
const secretKey = process.env.SECRET_KEY;

const verify = async (email, otp) => {
  const user = await findUserByProperty("email", email, false);

  if (!user) {
    throw createError("user not found", 404);
  }

  if (Number(user.otp) !== Number(otp)) {
    throw createError("invalid otp", 400);
  }

  const currentTime = new Date();

  if (currentTime > user.otpExpire) {
    throw createError("otp expired", 400);
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

  user.verified = true;
  user.otp = null;
  user.otpExpire = null;
  user.refreshToken = refreshToken;

  await user.save({ validateModifiedOnly: true });

  return { user, token, refreshToken };
};

module.exports = { verify };
