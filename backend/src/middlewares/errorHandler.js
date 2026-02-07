import { ErrorCodes, ErrorMessages } from '../config/errorCodes.js';

export class AppError extends Error {
  constructor(errorCode, statusCode = 500, details = null) {
    super(ErrorMessages[errorCode] || 'Une erreur est survenue');
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      errorCode: err.errorCode,
      message: err.message,
      details: err.details
    });
  }

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      errorCode: ErrorCodes.VALIDATION_ERROR,
      message: 'Erreur de validation',
      details
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      errorCode: ErrorCodes.USER_EXISTS,
      message: `Un enregistrement avec ce ${field} existe déjà`,
      details: { field }
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      errorCode: ErrorCodes.VALIDATION_ERROR,
      message: `Format invalide pour ${err.path}`,
      details: { field: err.path, value: err.value }
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      errorCode: ErrorCodes.TOKEN_INVALID,
      message: ErrorMessages[ErrorCodes.TOKEN_INVALID]
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      errorCode: ErrorCodes.TOKEN_EXPIRED,
      message: ErrorMessages[ErrorCodes.TOKEN_EXPIRED]
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      errorCode: ErrorCodes.FILE_TOO_LARGE,
      message: ErrorMessages[ErrorCodes.FILE_TOO_LARGE]
    });
  }

  return res.status(500).json({
    success: false,
    errorCode: ErrorCodes.INTERNAL_ERROR,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : ErrorMessages[ErrorCodes.INTERNAL_ERROR]
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    errorCode: ErrorCodes.NOT_FOUND,
    message: `Route ${req.method} ${req.originalUrl} non trouvée`
  });
};
