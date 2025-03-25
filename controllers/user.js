const userService = require("../services/user");
const createError = require("../utils/error");

const findAllUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUsers();

    res.status(200).json({
      success: true,
      message: "all users list",
      users,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { userID } = req.params;

  try {
    const deletedUser = await userService.deleteUser(userID);

    if (!deletedUser) {
      return next(createError("user not found", 404));
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = { findAllUsers, deleteUser };
