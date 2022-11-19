import { NextFunction, Request, Response } from 'express';
import { sendMsgResponse } from '../lib/index.js';

export const requireAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.query.accessToken)
    res.status(404).send({ msg: 'Access token must be provided.' });
  else next();
};

export const requireAccessTokenInBody = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { accessToken } = req.body;
  if (!accessToken) sendMsgResponse(res, 404, 'Access token must be provided')
  else next();
};
