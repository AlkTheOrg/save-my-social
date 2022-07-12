import { Router } from 'express';
import spotifyController from '../controllers/spotifyController.js';
const router = Router();

router.get('/login', spotifyController.login);
router.get('/logged', spotifyController.logged);
router.get('/playlists', spotifyController.playlists);

export default router;
