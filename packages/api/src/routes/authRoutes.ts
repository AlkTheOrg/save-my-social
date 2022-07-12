import { Router } from 'express';
import SpotifyRoutes from '../routes/spotifyRoutes.js';
import RedditRoutes from '../routes/redditRoutes.js';
const router = Router();

router.use('/spotify', SpotifyRoutes);
router.use('/reddit', RedditRoutes);

export default router;
