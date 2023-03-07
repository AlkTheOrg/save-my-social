import { Request, Response, Router } from 'express';
import SpotifyRoutes from '../routes/spotifyRoutes.js';
import RedditRoutes from '../routes/redditRoutes.js';
import NotionRoutes from '../routes/notionRoutes.js';
import GoogleRoutes from '../routes/googleRoutes.js';
import TwitterRoutes from '../routes/twitterRoutes.js';
import { ActiveApp } from '../controllers/types.js';
import redditController from '../controllers/redditController.js';
import notionController from '../controllers/notionController.js';
import spotifyController from '../controllers/spotifyController.js';
import googleController from '../controllers/googleController.js';
import twitterController from '../controllers/twitterController.js';
const router = Router();

router.get('/auth-url', (req: Request, res: Response) => {
  const appName = req.query.app as ActiveApp | undefined;
  try {
    switch (appName) {
      case 'reddit':
        redditController.redirectUrl(req, res);
        break;
      case 'notion':
        notionController.redirectUrl(req, res);
        break;
      case 'spotify':
        spotifyController.redirectUrl(req, res);
        break;
      case 'sheets':
        googleController.redirectUrl(req, res);
        break;
      case 'twitter':
        twitterController.redirectUrl(req, res);
        break;
      default:
        res.status(404).send({ msg: `${appName} is not a supported app.`});
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ msg: 'An error occured while getting the Auth URL.'})
  }
});
router.use('/spotify', SpotifyRoutes);
router.use('/reddit', RedditRoutes);
router.use('/notion', NotionRoutes);
router.use('/google', GoogleRoutes);
router.use('/twitter', TwitterRoutes); // For now, can not be used as there is no db to hold verifier tokens

export default router;
