import { eventService } from '../services/index.js';
import { asyncHandler } from '../middlewares/index.js';

export const getEvents = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const isAdmin = req.user?.role === 'admin';
  
  const result = await eventService.findAll(req.query, userId, isAdmin);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

export const getEvent = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const isAdmin = req.user?.role === 'admin';
  
  const event = await eventService.findById(req.params.id, userId, isAdmin);
  
  res.status(200).json({
    success: true,
    data: event
  });
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.create(req.body, req.user._id);
  
  res.status(201).json({
    success: true,
    message: 'Événement créé avec succès',
    data: event
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const event = await eventService.update(req.params.id, req.body, req.user._id, isAdmin);
  
  res.status(200).json({
    success: true,
    message: 'Événement mis à jour avec succès',
    data: event
  });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const result = await eventService.delete(req.params.id, req.user._id, isAdmin);
  
  res.status(200).json({
    success: true,
    message: result.message
  });
});

export const registerToEvent = asyncHandler(async (req, res) => {
  const registration = await eventService.register(req.params.id, req.user._id);
  
  res.status(201).json({
    success: true,
    message: 'Inscription réussie',
    data: registration
  });
});

export const unregisterFromEvent = asyncHandler(async (req, res) => {
  const result = await eventService.unregister(req.params.id, req.user._id);
  
  res.status(200).json({
    success: true,
    message: result.message
  });
});

export const getEventRegistrations = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const registrations = await eventService.getRegistrations(req.params.id, req.user._id, isAdmin);
  
  res.status(200).json({
    success: true,
    data: registrations
  });
});

export const getMyEvents = asyncHandler(async (req, res) => {
  const result = await eventService.getUserEvents(req.user._id, req.query);
  
  res.status(200).json({
    success: true,
    ...result
  });
});

export const getMyRegistrations = asyncHandler(async (req, res) => {
  const result = await eventService.getUserRegistrations(req.user._id, req.query);
  
  res.status(200).json({
    success: true,
    ...result
  });
});
