const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  refreshToken: String,
  otp: String,
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = model("User", userSchema);

module.exports = User;
