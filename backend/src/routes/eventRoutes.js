import { Router } from 'express';
import * as eventController from '../controllers/eventController.js';
import * as fileController from '../controllers/fileController.js';
import { 
  authenticate, 
  optionalAuth, 
  authorize, 
  validate, 
  eventSchemas, 
  querySchemas,
  uploadSingle 
} from '../middlewares/index.js';

const router = Router();

router.get('/', 
  optionalAuth,
  validate(querySchemas.pagination, 'query'),
  eventController.getEvents
);

router.get('/:id', 
  optionalAuth,
  eventController.getEvent
);

router.post('/', 
  authenticate,
  validate(eventSchemas.create),
  eventController.createEvent
);

router.put('/:id', 
  authenticate,
  validate(eventSchemas.update),
  eventController.updateEvent
);

router.delete('/:id', 
  authenticate,
  eventController.deleteEvent
);

router.post('/:id/register', 
  authenticate,
  eventController.registerToEvent
);

router.delete('/:id/register', 
  authenticate,
  eventController.unregisterFromEvent
);

router.get('/:id/registrations', 
  authenticate,
  eventController.getEventRegistrations
);

router.post('/:id/cover', 
  authenticate,
  uploadSingle('cover'),
  fileController.uploadEventCover
);

export default router;
