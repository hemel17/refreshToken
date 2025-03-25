const router = require("express").Router();
const userController = require("../controllers/user");

router.get("/all-users", userController.findAllUsers);
router.delete("/delete/:userID", userController.deleteUser);

module.exports = router;
