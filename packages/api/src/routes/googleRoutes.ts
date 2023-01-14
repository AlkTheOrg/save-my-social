import { Router } from 'express';
import googleController from '../controllers/googleController.js';
import { requireAccessTokenInBody } from '../middlewares/index.js';

const router = Router();
router.use('/login', googleController.login);
router.use('/logged', googleController.logged);
router.get('/auth-url', googleController.redirectUrl);
router.post(
  '/sheets/importItems',
  requireAccessTokenInBody,
  googleController.importItemsToSheets
);

export default router;
