const createError = require("../utils/error");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const userService = require("../services/user");
const jwtToken = require("../utils/jwtToken");

const tryRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(createError("authentication required", 401));
    }

    jwt.verify(refreshToken, secretKey, async (err, decoded) => {
      if (err) {
        return next(createError("invalid refresh token", 401));
      }

      const user = await userService.findUserByProperty("_id", decoded._id);

      if (!user || user.refreshToken !== refreshToken) {
        return next(createError("invalid refresh token", 401));
      }

      const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        role: user.role,
      };

      const newToken = await jwtToken.access(payload, secretKey);
      const newRefreshToken = await jwtToken.refresh(payload, secretKey);

      user.refreshToken = newRefreshToken;
      await user.save();

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: false,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      req.user = payload;
      next();
    });
  } catch (error) {
    console.error(error);
    next(createError("authentication failed", 500));
  }
};

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(createError("authentication required", 401));
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return tryRefreshToken(req, res, next);
        }

        return next(createError("invalid token", 401));
      }

      const user = await userService.findUserByProperty("_id", decoded._id);

      if (!user) {
        return next(createError("user no longer exists", 401));
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error(error);
    next(createError("authentication failed", 500));
  }
};

const authorize = (roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(createError("authentication required", 401));
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return next(createError("access forbidden", 403));
  };
};

module.exports = { authenticate, authorize };
