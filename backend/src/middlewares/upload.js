import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import config from '../config/index.js';
import { AppError } from './errorHandler.js';
import { ErrorCodes } from '../config/errorCodes.js';

const uploadDir = path.resolve(config.upload.path);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(ErrorCodes.FILE_TYPE_NOT_ALLOWED, 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize
  }
});

export const uploadSingle = (fieldName = 'file') => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError(ErrorCodes.FILE_TOO_LARGE, 400));
        }
        return next(new AppError(ErrorCodes.FILE_UPLOAD_ERROR, 400));
      }
      if (err) {
        return next(err);
      }
      next();
    });
  };
};

export const uploadMultiple = (fieldName = 'files', maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError(ErrorCodes.FILE_TOO_LARGE, 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError(ErrorCodes.VALIDATION_ERROR, 400, 
            [{ field: 'files', message: `Maximum ${maxCount} fichiers autorisés` }]));
        }
        return next(new AppError(ErrorCodes.FILE_UPLOAD_ERROR, 400));
      }
      if (err) {
        return next(err);
      }
      next();
    });
  };
};

export const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.resolve(uploadDir, filePath);
    
    fs.unlink(fullPath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Erreur suppression fichier:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export default upload;
