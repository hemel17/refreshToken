const router = require("express").Router();
const authRoutes = require("./auth");

// * auth routes
router.use("/api/v1/auth", authRoutes);

module.exports = router;
