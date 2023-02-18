import { Router } from 'express';
import redditController from '../controllers/redditController.js';
import { passAppAccessToken } from '../middlewares/index.js';

const router = Router();
router.get('/auth-url', redditController.redirectUrl);
router.get('/login', redditController.login);
router.get('/logged', redditController.logged);
router.post(
  '/savedModels',
  passAppAccessToken,
  redditController.getSavedModels,
);

export default router;
