import { Router } from 'express';
import redditController from '../controllers/redditController.js';

const router = Router();
router.use('/login', redditController.login);
router.use('/logged', redditController.logged);

export default router;
