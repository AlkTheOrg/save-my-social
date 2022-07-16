import { Router } from 'express';
import googleController from '../controllers/googleController.js';

const router = Router();
router.use('/login', googleController.login);
router.use('/logged', googleController.logged);

export default router;
