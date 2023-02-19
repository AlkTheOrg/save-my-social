import { getAccessToken } from './../lib/accessTokenManager.js';
import { NextFunction, Request, Response } from 'express';
import { ActiveApp, RequestWithAT } from '../controllers/types.js';
import { sendMsgResponse } from '../lib/index.js';

export const requireAccessTokenInBody = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { accessToken } = req.body;
  if (!accessToken) sendMsgResponse(res, 404, 'Access token must be provided')
  else next();
};

export const passAppAccessToken = (
  req: RequestWithAT,
  res: Response,
  next: NextFunction
): void => {
  const appType = req.originalUrl.split('/')[1] as ActiveApp | 'google';
  const accessToken = getAccessToken(appType === 'google' ? 'sheets' : appType);
  if (!accessToken) {
    res.status(400).send({ msg: `Access token for ${appType} is not set.`})
  } else {
    req.accessToken = accessToken;
    next();
  }
}
