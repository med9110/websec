import { Event, Registration, File } from '../models/index.js';
import { AppError, deleteFile } from '../middlewares/index.js';
import { ErrorCodes } from '../config/errorCodes.js';

class EventService {
  async create(eventData, organizerId) {
    const event = await Event.create({
      ...eventData,
      organizer: organizerId
    });

    return event.populate('organizer', 'firstName lastName email');
  }

  async findAll(queryParams, userId = null, isAdmin = false) {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search,
      category,
      status,
      city,
      startDateFrom,
      startDateTo,
      priceMin,
      priceMax,
      organizer
    } = queryParams;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    if (category) filter.category = category;
    
    if (!isAdmin) {
      if (userId) {
        const publishedOrOwner = {
          $or: [
            { status: 'published' },
            { organizer: userId }
          ]
        };

        if (filter.$or) {
          // There's a search filter using $or - combine with $and
          filter.$and = [
            publishedOrOwner,
            { $or: filter.$or }
          ];
          delete filter.$or;
        } else {
          // No search filter, just add status/owner condition
          Object.assign(filter, publishedOrOwner);
        }
      } else {
        if (filter.$or) {
          filter.$and = [
            { status: 'published' },
            { $or: filter.$or }
          ];
          delete filter.$or;
        } else {
          filter.status = 'published';
        }
      }
    } else if (status) {
      filter.status = status;
    }

    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (organizer) filter.organizer = organizer;

    if (startDateFrom || startDateTo) {
      filter.startDate = {};
      if (startDateFrom) filter.startDate.$gte = new Date(startDateFrom);
      if (startDateTo) filter.startDate.$lte = new Date(startDateTo);
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      filter.price = {};
      if (priceMin !== undefined) filter.price.$gte = parseFloat(priceMin);
      if (priceMax !== undefined) filter.price.$lte = parseFloat(priceMax);
    }

    const skip = (page - 1) * limit;

    const sortObj = this.parseSortString(sort);

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate('organizer', 'firstName lastName email')
        .populate('coverImage')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit)),
      Event.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async findById(eventId, userId = null, isAdmin = false) {
    const event = await Event.findById(eventId)
      .populate('organizer', 'firstName lastName email avatar')
      .populate('coverImage');

    if (!event) {
      throw new AppError(ErrorCodes.EVENT_NOT_FOUND, 404);
    }

    if (event.status !== 'published' && !isAdmin) {
      if (!userId || event.organizer._id.toString() !== userId.toString()) {
        throw new AppError(ErrorCodes.EVENT_NOT_FOUND, 404);
      }
    }

    const registrationCount = await Registration.countDocuments({ 
      event: eventId, 
      status: 'confirmed' 
    });

    const eventObj = event.toObject();
    eventObj.registrationCount = registrationCount;
    eventObj.isFull = registrationCount >= event.capacity;
    eventObj.availableSpots = Math.max(0, event.capacity - registrationCount);

    if (userId) {
      const registration = await Registration.findOne({ 
        event: eventId, 
        user: userId,
        status: 'confirmed'
      });
      eventObj.isRegistered = !!registration;
      eventObj.registrationStatus = registration?.status || null;
    }

    return eventObj;
  }

  async update(eventId, updateData, userId, isAdmin = false) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(ErrorCodes.EVENT_NOT_FOUND, 404);
    }

    if (!isAdmin && event.organizer.toString() !== userId.toString()) {
      throw new AppError(ErrorCodes.FORBIDDEN, 403);
    }

    Object.assign(event, updateData);
    await event.save();

    return event.populate('organizer', 'firstName lastName email');
  }

  async delete(eventId, userId, isAdmin = false) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(ErrorCodes.EVENT_NOT_FOUND, 404);
    }

    if (!isAdmin && event.organizer.toString() !== userId.toString()) {
      throw new AppError(ErrorCodes.FORBIDDEN, 403);
    }

    if (event.coverImage) {
      try {
        const file = await File.findById(event.coverImage);
        if (file) {
          await deleteFile(file.filename);
          await file.deleteOne();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
      }
    }

    await Registration.deleteMany({ event: eventId });

    await event.deleteOne();

    return { message: 'Événement supprimé avec succès' };
  }

  async register(eventId, userId) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(ErrorCodes.EVENT_NOT_FOUND, 404);
    }

    if (event.status !== 'published') {
      throw new AppError(ErrorCodes.EVENT_NOT_FOUND, 404);
    }

    // Vérifier si l'utilisateur est admin
    const User = (await import('../models/User.js')).default;
    const userDoc = await User.findById(userId);
    if (userDoc && userDoc.role === 'admin') {
      throw new AppError(ErrorCodes.FORBIDDEN, 403);
    }

    const existingRegistration = await Registration.findOne({
      event: eventId,
      user: userId
    });

    if (existingRegistration) {
      if (existingRegistration.status === 'confirmed') {
        throw new AppError(ErrorCodes.ALREADY_REGISTERED, 409);
      }
      existingRegistration.status = 'confirmed';
      await existingRegistration.save();
      await event.incrementRegistration();
      return existingRegistration;
    }

    if (event.registrationCount >= event.capacity) {
      throw new AppError(ErrorCodes.EVENT_FULL, 400);
    }

    const registration = await Registration.create({
      event: eventId,
      user: userId,
      status: 'confirmed'
    });

    await event.incrementRegistration();

    return registration;
  }

  async unregister(eventId, userId) {
    const registration = await Registration.findOne({
      event: eventId,
      user: userId,
      status: 'confirmed'
    });

    if (!registration) {
      throw new AppError(ErrorCodes.NOT_REGISTERED, 400);
    }

    registration.status = 'cancelled';
    await registration.save();

    const event = await Event.findById(eventId);
    if (event) {
      await event.decrementRegistration();
    }

    return { message: 'Désinscription réussie' };
  }

  async getRegistrations(eventId, userId, isAdmin = false) {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError(ErrorCodes.EVENT_NOT_FOUND, 404);
    }

    if (!isAdmin && event.organizer.toString() !== userId.toString()) {
      throw new AppError(ErrorCodes.FORBIDDEN, 403);
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'firstName lastName email')
      .sort('-registeredAt');

    return registrations;
  }

  async getUserEvents(userId, queryParams) {
    return this.findAll({ ...queryParams, organizer: userId }, userId, true);
  }

  async getUserRegistrations(userId, queryParams) {
    const { page = 1, limit = 10 } = queryParams;
    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      Registration.find({ user: userId, status: 'confirmed' })
        .populate({
          path: 'event',
          populate: [
            { path: 'organizer', select: 'firstName lastName email' },
            { path: 'coverImage' }
          ]
        })
        .sort('-registeredAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Registration.countDocuments({ user: userId, status: 'confirmed' })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: registrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  parseSortString(sortString) {
    const sortObj = {};
    const fields = sortString.split(',');
    
    fields.forEach(field => {
      if (field.startsWith('-')) {
        sortObj[field.substring(1)] = -1;
      } else {
        sortObj[field] = 1;
      }
    });

    return sortObj;
  }
}

export default new EventService();
