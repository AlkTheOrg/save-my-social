import { getAppCredentials } from './../lib/index.js';
import { ReqWithCredentials, SmsApp } from './../controllers/types.js';
import { NextFunction, Request, Response } from 'express';
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

export const passAppCredentials = (
  req: ReqWithCredentials,
  _res: Response,
  next: NextFunction
): void => {
  const appType = req.originalUrl.split('/')[1] as Exclude<SmsApp, 'download'>;
  const credentials = getAppCredentials(appType);
  req.credentials = credentials;
  next();
}
