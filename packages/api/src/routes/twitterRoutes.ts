import { Router } from 'express';
import twitterController from '../controllers/twitterController.js';
import { passAppAccessToken } from '../middlewares/index.js';

const router = Router();
router.get('/login', twitterController.login);
router.get('/logged', twitterController.logged);
router.get( '/accessTokenIsSet', twitterController.accessTokenIsSet);
router.post(
  '/bookmarks',
  passAppAccessToken,
  // @ts-ignore
  twitterController.getBookmarks
);

export default router;
