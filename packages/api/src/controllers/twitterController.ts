import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import { ScopeVariables } from './types.js';
import { TwitterApi } from 'twitter-api-v2';

const codeVerifiers = [];

const {
  TWITTER_CLIENT_ID,
  TWITTER_REDIRECT_URI,
  TWITTER_SECRET,
  TWITTER_STATE,
} = process.env;

const scopeVariables: ScopeVariables = [
  "tweet.read",
  "users.read",
  "bookmark.read",
  "bookmark.write",
]; // https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code

const twitterClient = new TwitterApi({
  clientId: TWITTER_CLIENT_ID,
  clientSecret: TWITTER_SECRET,
})

const redirectUrl = (_: Request, res: Response) => {
  const { url, codeVerifier } = twitterClient.generateOAuth2AuthLink(
    TWITTER_REDIRECT_URI,
    { scope: scopeVariables, state: TWITTER_STATE },
  );
  codeVerifiers.push(codeVerifier);
  res.send({ url });
}

const login = (_: Request, res: Response) => {
  const { url, codeVerifier } = twitterClient.generateOAuth2AuthLink(
    TWITTER_REDIRECT_URI,
    { scope: scopeVariables, state: TWITTER_STATE },
  );
  codeVerifiers.push(codeVerifier);
  res.redirect(url);
}

const logged = async (req: Request, res: Response) => {
  const code = (req.query.code as string) || null;
  const state = (req.query.state as string) || null;
  const error = (req.query.error as string) || null;

  if (error) {
    throw new Error(error);
  } else if (state === null) {
    throw new Error('State missing');
  } else if (state !== TWITTER_STATE) {
    throw new Error('Invalid state');
  } else {
    const { client: _client, accessToken } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier: codeVerifiers.pop(),
      redirectUri: TWITTER_REDIRECT_URI,
    });
    res.send({ access_token: accessToken });
  }
}

export default {
  redirectUrl,
  login,
  logged
}
