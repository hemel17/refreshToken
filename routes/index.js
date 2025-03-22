const router = require("express").Router();
const authRoutes = require("./auth");
const otpRoutes = require("./otp");

// * auth routes
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/otp", otpRoutes);

module.exports = router;
