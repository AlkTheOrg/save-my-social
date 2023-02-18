import { Router } from 'express';
import redditController from '../controllers/redditController.js';
import { passAppCredentials } from '../middlewares/index.js';

const router = Router();
router.post( '/savedModels', passAppCredentials, redditController.getSavedModels);

export default router;
