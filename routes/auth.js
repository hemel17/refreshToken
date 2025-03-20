const router = require("express").Router();
const authController = require("../controllers/auth");

// * register user
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
