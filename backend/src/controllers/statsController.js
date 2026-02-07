import { statsService } from '../services/index.js';
import { asyncHandler } from '../middlewares/index.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';
  
  const stats = await statsService.getDashboardStats(userId, isAdmin);
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

export const getEventsByCategory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';
  
  const stats = await statsService.getEventsByCategory(userId, isAdmin);
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

export const getEventsByStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';
  
  const stats = await statsService.getEventsByStatus(userId, isAdmin);
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

export const getRegistrationsTrend = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';
  
  const stats = await statsService.getRegistrationsTrend(userId, isAdmin);
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

export const getEventsTrend = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';
  
  const stats = await statsService.getEventsTrend(userId, isAdmin);
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

export const getTopEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';
  const limit = parseInt(req.query.limit) || 5;
  
  const events = await statsService.getTopEvents(userId, isAdmin, limit);
  
  res.status(200).json({
    success: true,
    data: events
  });
});

export const getUpcomingEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin';
  const limit = parseInt(req.query.limit) || 5;
  
  const events = await statsService.getUpcomingEvents(userId, isAdmin, limit);
  
  res.status(200).json({
    success: true,
    data: events
  });
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getAdminStats();
  
  res.status(200).json({
    success: true,
    data: stats
  });
});
