import { Router } from 'express';
import twitterController from '../controllers/twitterController.js';

const router = Router();
router.use('/login', twitterController.login);
router.use('/logged', twitterController.logged);
router.use('/auth-url', twitterController.redirectUrl);
router.use('/accessTokenIsSet', twitterController.accessTokenIsSet);

export default router;
