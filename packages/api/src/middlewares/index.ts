import { NextFunction, Request, Response } from 'express';

export const requireAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.query.access_token)
    res.status(404).send({ msg: 'Access token must be provided.' });
  else next();
};
