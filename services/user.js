const User = require("../models/User");

const findUserByProperty = (key, value, verified = false) => {
  if (key === "_id") {
    return User.findById(value);
  }

  return User.findOne({ [key]: value, verified }).select("+password");
};

const findAllUsers = () => {
  return User.find();
};

const createNewUser = (name, email, password) => {
  const user = new User({ name, email, password });
  return user.save();
};

const deleteUser = (userID) => {
  return User.findByIdAndDelete(userID);
};

module.exports = {
  findUserByProperty,
  findAllUsers,
  createNewUser,
  deleteUser,
};
