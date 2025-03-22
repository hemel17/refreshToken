const router = require("express").Router();
const otpController = require("../controllers/otp");

router.post("/verify", otpController.verifyOtp);

module.exports = router;
