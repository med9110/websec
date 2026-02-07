import { Router } from 'express';
import authRoutes from './authRoutes.js';
import eventRoutes from './eventRoutes.js';
import fileRoutes from './fileRoutes.js';
import statsRoutes from './statsRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API EventHub opérationnelle',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/files', fileRoutes);
router.use('/stats', statsRoutes);
router.use('/users', userRoutes);

export default router;
