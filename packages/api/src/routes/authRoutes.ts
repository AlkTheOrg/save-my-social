import { Router } from 'express';
import SpotifyRoutes from '../routes/spotifyRoutes.js';
import RedditRoutes from '../routes/redditRoutes.js';
import NotionRoutes from '../routes/notionRoutes.js';
import GoogleRoutes from '../routes/googleRoutes.js';
import TwitterRoutes from '../routes/twitterRoutes.js';
const router = Router();

router.use('/spotify', SpotifyRoutes);
router.use('/reddit', RedditRoutes);
router.use('/notion', NotionRoutes);
router.use('/google', GoogleRoutes);
// router.use('/twitter', TwitterRoutes); // For now, can not be used as there is no db to hold verifier tokens

export default router;
