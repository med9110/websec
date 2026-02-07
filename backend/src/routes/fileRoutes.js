import { Router } from 'express';
import * as fileController from '../controllers/fileController.js';
import { authenticate, optionalAuth, uploadSingle } from '../middlewares/index.js';

const router = Router();

router.get('/', 
  authenticate,
  fileController.getMyFiles
);

router.get('/:id', 
  optionalAuth,
  fileController.getFile
);

router.get('/:id/download', 
  optionalAuth,
  fileController.downloadFile
);

router.get('/:id/preview', 
  optionalAuth,
  fileController.previewFile
);

router.delete('/:id', 
  authenticate,
  fileController.deleteFile
);

export default router;
