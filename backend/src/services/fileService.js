import path from 'path';
import fs from 'fs';
import { File, Event, User } from '../models/index.js';
import { AppError, deleteFile } from '../middlewares/index.js';
import { ErrorCodes } from '../config/errorCodes.js';
import config from '../config/index.js';

class FileService {
  async upload(fileData, userId, associatedWith) {
    const { originalname, filename, mimetype, size, path: filePath } = fileData;

    const file = await File.create({
      originalName: originalname,
      filename,
      mimeType: mimetype,
      size,
      path: filePath,
      uploadedBy: userId,
      associatedWith,
      isPublic: associatedWith.model === 'Event'
    });

    return file;
  }

  async uploadEventCover(fileData, eventId, userId, isAdmin = false) {
    const event = await Event.findById(eventId);
    
    if (!event) {
      await deleteFile(fileData.filename);
      throw new AppError(ErrorCodes.EVENT_NOT_FOUND, 404);
    }

    if (!isAdmin && event.organizer.toString() !== userId.toString()) {
      await deleteFile(fileData.filename);
      throw new AppError(ErrorCodes.FORBIDDEN, 403);
    }

    if (event.coverImage) {
      try {
        const oldFile = await File.findById(event.coverImage);
        if (oldFile) {
          await deleteFile(oldFile.filename);
          await oldFile.deleteOne();
        }
      } catch (error) {
        console.error('Erreur suppression ancienne image:', error);
      }
    }

    const file = await this.upload(fileData, userId, {
      model: 'Event',
      id: eventId
    });

    event.coverImage = file._id;
    await event.save();

    return file;
  }

  async uploadUserAvatar(fileData, userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      await deleteFile(fileData.filename);
      throw new AppError(ErrorCodes.USER_NOT_FOUND, 404);
    }

    if (user.avatar) {
      try {
        const oldFile = await File.findById(user.avatar);
        if (oldFile) {
          await deleteFile(oldFile.filename);
          await oldFile.deleteOne();
        }
      } catch (error) {
        console.error('Erreur suppression ancien avatar:', error);
      }
    }

    const file = await this.upload(fileData, userId, {
      model: 'User',
      id: userId
    });

    user.avatar = file._id;
    await user.save();

    return file;
  }

  async findById(fileId) {
    const file = await File.findById(fileId).populate('uploadedBy', 'firstName lastName');
    
    if (!file) {
      throw new AppError(ErrorCodes.FILE_NOT_FOUND, 404);
    }

    return file;
  }

  async findByAssociation(model, id) {
    const files = await File.find({
      'associatedWith.model': model,
      'associatedWith.id': id
    }).sort('-createdAt');

    return files;
  }

  async delete(fileId, userId, isAdmin = false) {
    const file = await File.findById(fileId);

    if (!file) {
      throw new AppError(ErrorCodes.FILE_NOT_FOUND, 404);
    }

    if (!isAdmin && file.uploadedBy.toString() !== userId.toString()) {
      throw new AppError(ErrorCodes.FORBIDDEN, 403);
    }

    await deleteFile(file.filename);

    if (file.associatedWith.model === 'Event') {
      await Event.findByIdAndUpdate(file.associatedWith.id, { coverImage: null });
    } else if (file.associatedWith.model === 'User') {
      await User.findByIdAndUpdate(file.associatedWith.id, { avatar: null });
    }

    await file.deleteOne();

    return { message: 'Fichier supprimé avec succès' };
  }

  getFilePath(filename) {
    return path.resolve(config.upload.path, filename);
  }

  async fileExists(filename) {
    const filePath = this.getFilePath(filename);
    return fs.existsSync(filePath);
  }

  async canAccessFile(file, userId, isAdmin = false) {
    if (file.isPublic) return true;
    
    if (isAdmin) return true;
    
    if (file.uploadedBy.toString() === userId?.toString()) return true;

    if (file.associatedWith.model === 'Event') {
      const event = await Event.findById(file.associatedWith.id);
      if (event && event.organizer.toString() === userId?.toString()) {
        return true;
      }
    }

    return false;
  }
}

export default new FileService();
