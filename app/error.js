const createError = require("../utils/error");

const notFoundHandler = (_req, _res, next) => {
  const err = createError("Not found!", 404);
  next(err);
};

const errorHandler = (err, _req, res, _next) => {
  let errorStatus = err.status || 500;
  let errorMessage = err.message || "Internal server error!";

  if (err.name === "CastError") {
    errorMessage = `Invalid ${error.path}`;
    errorStatus = 400;
  }

  if (err.name === "JsonWebTokenError") {
    errorMessage = "Something went wrong! Please try again.";
    errorStatus = 400;
  }

  if (err.name === "TokenExpiredError") {
    errorMessage = "Session Expired! Please try again.";
    errorStatus = 400;
  }

  if (err.code === 11000) {
    errorMessage = `This ${Object.keys(error.keyValue)} is already in use!`;
    errorStatus = 400;
  }

  res.status(errorStatus).json({
    success: false,
    message: errorMessage,
  });
};

module.exports = { notFoundHandler, errorHandler };
