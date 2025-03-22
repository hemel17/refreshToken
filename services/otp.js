const createError = require("../utils/error");
const { findUserByProperty } = require("./user");

const verify = async (email, otp) => {
  const user = await findUserByProperty({ email });

  if (!user) {
    throw createError("user not found", 404);
  }

  if (user.otp !== Number(otp)) {
    throw createError("invalid otp", 400);
  }

  const currentTime = new Date();

  console.log(currentTime, user.otpExpire);

  if (currentTime > user.otpExpire) {
    throw createError("otp expired", 400);
  }

  user.verified = true;
  user.otp = null;
  user.otpExpire = null;

  await user.save({ validateModifiedOnly: true });

  return user;
};

module.exports = { verify };
