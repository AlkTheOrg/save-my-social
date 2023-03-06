import { Router } from 'express';
import notionController from '../controllers/notionController.js';
import { passAppAccessToken } from '../middlewares/index.js';

const router = Router();
router.get('/login', notionController.login);
router.get('/logged', notionController.logged);
router.post(
  '/importItems',
  passAppAccessToken,
  notionController.importItems,
);

export default router;
