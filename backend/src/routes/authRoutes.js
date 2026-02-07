import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, validate, authSchemas } from '../middlewares/index.js';

const router = Router();

router.post('/register', 
  validate(authSchemas.register), 
  authController.register
);

router.post('/login', 
  validate(authSchemas.login), 
  authController.login
);

router.post('/refresh', 
  validate(authSchemas.refresh), 
  authController.refresh
);

router.post('/logout', 
  authenticate, 
  authController.logout
);

router.get('/me', 
  authenticate, 
  authController.getMe
);

export default router;
