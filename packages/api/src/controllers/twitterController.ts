import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import { CustomRequestWithAT, ScopeVariables } from './types.js';
import { TwitterApi } from 'twitter-api-v2';
import { htmlPage } from '../lib/index.js';
import { getAccessToken, setAccessToken } from '../lib/accessTokenManager.js';
import { fetchBookmarks } from '../lib/twitter/index.js';

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
    console.log(error);
    res.send(htmlPage(`
      <h4>An error occured: "${error}"</h4>
      <h4>You can close this window and try again.</h4>
    `));
  } else if (state === null || state !== TWITTER_STATE) {
    res.send(htmlPage(`
      <h3>Your TWITTER_STATE token is not same with "${state}"</h3>
      <h4>You can close this window and try again.</h4>
    `));
  } else {
    try {
      const { client: _client, accessToken } = await twitterClient.loginWithOAuth2({
        code,
        codeVerifier: codeVerifiers.pop(),
        redirectUri: TWITTER_REDIRECT_URI,
      });
      setAccessToken('twitter', accessToken);
      res.send(htmlPage(`
        <h3>Success!</h3>
        <h4>You can close this window.</h3>
      `))
    } catch (err) {
      console.log(err);
      res.send(htmlPage(`
        <h3>Eror while getting the access token: "${JSON.stringify(err)}"</h3>
        <h4>You can close this window and try again.</h4>
      `));
    }
  }
}

const accessTokenIsSet = (_req: Request, res: Response) => {
  res.send(Boolean(getAccessToken('twitter')));
}

const getBookmarks = async (req: CustomRequestWithAT<{ pagination_token?: string }>, res: Response) => {
  try {
    const result = await fetchBookmarks(req.accessToken, req.body.pagination_token);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
}

export default {
  redirectUrl,
  login,
  logged,
  accessTokenIsSet,
  getBookmarks
}
