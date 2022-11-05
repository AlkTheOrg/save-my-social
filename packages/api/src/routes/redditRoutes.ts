import { Router } from 'express';
import redditController from '../controllers/redditController.js';

const router = Router();
router.use('/auth-url', redditController.redirectUrl);
router.use('/login', redditController.login);
router.use('/logged', redditController.logged);
router.use('/savedModels', redditController.getSavedModels);

export default router;
