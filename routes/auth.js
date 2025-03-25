const router = require("express").Router();
const authController = require("../controllers/auth");
const { authenticate } = require("../middlewares/authenticate");

// * register user
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authenticate, authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:resetToken", authController.resetPassword);

module.exports = router;
