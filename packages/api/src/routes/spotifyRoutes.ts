import { Router } from 'express';
import spotifyController from '../controllers/spotifyController.js';
import { requireAccessTokenInBody } from '../middlewares/index.js';
const router = Router();

router.get('/login', spotifyController.login);
router.get('/logged', spotifyController.logged);
router.post('/playlists', requireAccessTokenInBody, spotifyController.playlists);

export default router;
