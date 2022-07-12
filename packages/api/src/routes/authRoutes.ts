import { Router } from 'express';
import SpotifyRoutes from '../routes/spotifyRoutes.js';
import RedditRoutes from '../routes/redditRoutes.js';
import NotionRoutes from '../routes/notionRoutes.js';
const router = Router();

router.use('/spotify', SpotifyRoutes);
router.use('/reddit', RedditRoutes);
router.use('/notion', NotionRoutes);

export default router;
