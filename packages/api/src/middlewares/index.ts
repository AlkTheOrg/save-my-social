import { getAccessToken } from './../lib/accessTokenManager.js';
import { RequestHandler } from 'express';
import { ActiveApp, RequestWithAT } from '../controllers/types.js';

export type RequestHandlerWithAT<T = any> = RequestHandler<
  { accessToken: string } & T
>;

export const passAppAccessToken: RequestHandlerWithAT = (req, res, next): void => {
  const appType = req.originalUrl.split('/')[1] as ActiveApp | 'google';
  const accessToken = getAccessToken(appType === 'google' ? 'sheets' : appType);
  if (!accessToken) {
    res.status(400).send({ msg: `Access token for ${appType} is not set. Please try reauthenticating the app.`})
  } else {
    (req as RequestWithAT).accessToken = accessToken;
    next();
  }
}
