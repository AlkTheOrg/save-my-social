import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { ScopeVariables } from '../controllers/types.js';
import drive from '@googleapis/drive';
import sheets from '@googleapis/sheets';
import youtube from '@googleapis/youtube';
dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_SECRET } = process.env;

const login = (_: Request, res: Response) => {
  const oauth2Client = new drive.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_SECRET,
    GOOGLE_REDIRECT_URI,
  );
  const scopes: ScopeVariables = ['https://www.googleapis.com/auth/drive'];
  const url = oauth2Client.generateAuthUrl({
    scope: scopes,
  });

  res.redirect(url);
};

const logged = async (req: Request, res: Response) => {
  const code = (req.query.code as string) || null;
  const state = (req.query.state as string) || null;
  const error = (req.query.error as string) || null;

  const oauth2Client = new drive.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_SECRET,
    GOOGLE_REDIRECT_URI,
  );

  const { tokens: { access_token }} = await oauth2Client.getToken(code);
  res.send({ access_token });
};

export default {
  login,
  logged,
};
