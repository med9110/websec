import { Router } from 'express';
import * as eventController from '../controllers/eventController.js';
import * as fileController from '../controllers/fileController.js';
import { authenticate, uploadSingle, validate, querySchemas } from '../middlewares/index.js';

const router = Router();

router.use(authenticate);

router.get('/me/events', 
  validate(querySchemas.pagination, 'query'),
  eventController.getMyEvents
);

router.get('/me/registrations', 
  validate(querySchemas.pagination, 'query'),
  eventController.getMyRegistrations
);

router.post('/me/avatar', 
  uploadSingle('avatar'),
  fileController.uploadAvatar
);

export default router;
