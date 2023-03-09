import { initTRPC } from "@trpc/server";
import { ActiveApp } from "./controllers/types.js";
import { generateTwitterRedirectUrl } from './controllers/twitterController.js';
import { generateSpotifyRedirectUrl } from './controllers/spotifyController.js';
import { generateNotionRedirectUrl } from './controllers/notionController.js';
import { generateGoogleRedirectUrl } from "./controllers/googleController.js";
import { generateRedditRedirectUrl } from './controllers/redditController.js';

const t = initTRPC.create();

const router = t.router;

export const appRouter = router({
  'authUrl': t.procedure
    .input(ActiveApp)
    .query(req => {
      const { input } = req;
      switch (input) {
        case 'notion':
          return generateNotionRedirectUrl();
        case 'reddit':
          return generateRedditRedirectUrl();
        case 'sheets':
          return generateGoogleRedirectUrl();
        case 'spotify':
          return generateSpotifyRedirectUrl();
        case 'twitter':
          return generateTwitterRedirectUrl();
        default:
          throw new Error(`App ${input} is not active yet.`)
      }
    })
});
