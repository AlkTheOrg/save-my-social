import { Router } from 'express';
import spotifyController from '../controllers/spotifyController.js';
import { passAppAccessToken } from '../middlewares/index.js';
const router = Router();

router.get('/login', spotifyController.login);
router.get('/logged', spotifyController.logged);
router.post(
  '/playlists',
  passAppAccessToken,
  // @ts-ignore
  spotifyController.playlists
);
router.post(
  '/playlistTracks',
  passAppAccessToken,
  // @ts-ignore
  spotifyController.getPlaylistTracks
);

export default router;
