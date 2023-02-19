import { Router } from 'express';
import googleController from '../controllers/googleController.js';
import { passAppAccessToken } from '../middlewares/index.js';

const router = Router();
router.use('/login', googleController.login);
router.use('/logged', googleController.logged);
router.get('/auth-url', googleController.redirectUrl);
router.post(
  '/sheets/importItems',
  passAppAccessToken,
  googleController.importItemsToSheets
);

export default router;
