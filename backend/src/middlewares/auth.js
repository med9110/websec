import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User } from '../models/index.js';
import { AppError } from './errorHandler.js';
import { ErrorCodes } from '../config/errorCodes.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(ErrorCodes.TOKEN_MISSING, 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new AppError(ErrorCodes.TOKEN_INVALID, 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(ErrorCodes.TOKEN_EXPIRED, 401));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError(ErrorCodes.TOKEN_INVALID, 401));
    }
    next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(ErrorCodes.TOKEN_MISSING, 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(ErrorCodes.INSUFFICIENT_PERMISSIONS, 403));
    }

    next();
  };
};

export const authorizeOwnerOrAdmin = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError(ErrorCodes.TOKEN_MISSING, 401));
      }

      if (req.user.role === 'admin') {
        return next();
      }

      const ownerId = await getResourceOwnerId(req);
      
      if (!ownerId) {
        return next(new AppError(ErrorCodes.NOT_FOUND, 404));
      }

      if (ownerId.toString() !== req.user._id.toString()) {
        return next(new AppError(ErrorCodes.FORBIDDEN, 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};
