import { Router } from 'express';
import * as statsController from '../controllers/statsController.js';
import { authenticate, authorize } from '../middlewares/index.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', statsController.getDashboardStats);

router.get('/events/category', statsController.getEventsByCategory);

router.get('/events/status', statsController.getEventsByStatus);

router.get('/events/trend', statsController.getEventsTrend);

router.get('/events/top', statsController.getTopEvents);

router.get('/events/upcoming', statsController.getUpcomingEvents);

router.get('/registrations/trend', statsController.getRegistrationsTrend);

router.get('/admin', authorize('admin'), statsController.getAdminStats);

export default router;
