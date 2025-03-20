const router = require("express").Router();
const authController = require("../controllers/auth");

// * register user
router.post("/register", authController.register);

module.exports = router;
