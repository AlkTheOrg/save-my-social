import { Router } from 'express';
import redditController from '../controllers/redditController.js';
import { requireAccessTokenInBody } from '../middlewares/index.js';

const router = Router();
router.get('/auth-url', redditController.redirectUrl);
router.get('/login', redditController.login);
router.get('/logged', redditController.logged);
router.post(
  '/savedModels',
  requireAccessTokenInBody,
  redditController.getSavedModels,
);

export default router;
