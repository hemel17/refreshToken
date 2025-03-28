const { Schema, model } = require("mongoose");
const bcrypt = require("../utils/bcrypt");
const crypto = require("crypto");

const userSchema = new Schema(
  {
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
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: Number,
    otpExpire: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpire: Date,
    refreshToken: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.comparePassword(enteredPassword, this.password);
};

userSchema.methods.generateOtp = function () {
  const otp = Math.floor(10000 + Math.random() * 90000);
  this.otp = otp;
  this.otpExpire = new Date(Date.now() + 5 * 60 * 1000);

  return otp;
};

userSchema.methods.generateForgotPasswordToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.forgotPasswordTokenExpire = new Date(Date.now() + 5 * 60 * 1000);

  return token;
};

const User = model("User", userSchema);

module.exports = User;
