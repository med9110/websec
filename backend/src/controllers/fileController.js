import path from 'path';
import fs from 'fs';
import { fileService } from '../services/index.js';
import { asyncHandler, AppError } from '../middlewares/index.js';
import { ErrorCodes } from '../config/errorCodes.js';
import config from '../config/index.js';

export const uploadEventCover = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(ErrorCodes.VALIDATION_ERROR, 400, [
      { field: 'file', message: 'Aucun fichier fourni' }
    ]);
  }

  const isAdmin = req.user.role === 'admin';
  const file = await fileService.uploadEventCover(req.file, req.params.id, req.user._id, isAdmin);
  
  res.status(201).json({
    success: true,
    message: 'Image de couverture uploadée avec succès',
    data: file
  });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(ErrorCodes.VALIDATION_ERROR, 400, [
      { field: 'file', message: 'Aucun fichier fourni' }
    ]);
  }

  const file = await fileService.uploadUserAvatar(req.file, req.user._id);
  
  res.status(201).json({
    success: true,
    message: 'Avatar uploadé avec succès',
    data: file
  });
});

export const getFile = asyncHandler(async (req, res) => {
  const file = await fileService.findById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: file
  });
});

export const downloadFile = asyncHandler(async (req, res) => {
  const file = await fileService.findById(req.params.id);
  const userId = req.user?._id;
  const isAdmin = req.user?.role === 'admin';

  const canAccess = await fileService.canAccessFile(file, userId, isAdmin);
  if (!canAccess) {
    throw new AppError(ErrorCodes.FORBIDDEN, 403);
  }

  const filePath = fileService.getFilePath(file.filename);
  
  if (!fs.existsSync(filePath)) {
    throw new AppError(ErrorCodes.FILE_NOT_FOUND, 404);
  }

  res.download(filePath, file.originalName);
});

export const previewFile = asyncHandler(async (req, res) => {
  const file = await fileService.findById(req.params.id);
  const userId = req.user?._id;
  const isAdmin = req.user?.role === 'admin';

  const canAccess = await fileService.canAccessFile(file, userId, isAdmin);
  if (!canAccess) {
    throw new AppError(ErrorCodes.FORBIDDEN, 403);
  }

  const filePath = fileService.getFilePath(file.filename);
  
  if (!fs.existsSync(filePath)) {
    throw new AppError(ErrorCodes.FILE_NOT_FOUND, 404);
  }

  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
  
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

export const deleteFile = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const result = await fileService.delete(req.params.id, req.user._id, isAdmin);
  
  res.status(200).json({
    success: true,
    message: result.message
  });
});

export const getMyFiles = asyncHandler(async (req, res) => {
  const files = await fileService.findByAssociation('User', req.user._id);
  
  res.status(200).json({
    success: true,
    data: files
  });
});
