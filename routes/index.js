const router = require("express").Router();
const authRoutes = require("./auth");
const otpRoutes = require("./otp");
const userRoutes = require("./user");

// * auth routes
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/otp", otpRoutes);

// * user routes
router.use("/api/v1/user", userRoutes);

module.exports = router;
