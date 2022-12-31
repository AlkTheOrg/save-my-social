import { Router } from 'express';
import notionController from '../controllers/notionController.js';
import { requireAccessTokenInBody } from '../middlewares/index.js';

const router = Router();
router.get('/auth-url', notionController.redirectUrl);
router.get('/login', notionController.login);
router.get('/logged', notionController.logged);
router.post(
  '/importItems',
  requireAccessTokenInBody,
  notionController.importItems,
);

export default router;
