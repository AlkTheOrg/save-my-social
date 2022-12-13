import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { ScopeVariables } from '../controllers/types.js';
// import drive from '@googleapis/drive'; //TODO uninstall these packages if there is no way to setCredentials with them
// import sheets from '@googleapis/sheets';
// import youtube from '@googleapis/youtube';
import { google } from "googleapis";
import { getWindowErrorPosterHTML } from './../lib/index.js';
import { getWindowAccessTokenPosterHTML } from '../lib/index.js';
dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_SECRET, GOOGLE_STATE } = process.env;
const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_SECRET,
    GOOGLE_REDIRECT_URI,
  );

const login = (_: Request, res: Response) => {
  const scopes: ScopeVariables = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/spreadsheets',
  ];
  const url = oauth2Client.generateAuthUrl({
    scope: scopes,
  });

  res.redirect(url);
};

const logged = async (req: Request, res: Response) => {
  const code = (req.query.code as string) || null;
  const state = (req.query.state as string) || null;
  const error = (req.query.error as string) || null;

  if (error) {
    console.log(error);
    res.send(getWindowErrorPosterHTML(error))
  // } else if (state === null) {
  //   console.log('state is missing');
  //   res.send(getWindowErrorPosterHTML('State missing'))
  } else {
    // const oauth2Client = new google.auth.OAuth2(
    //   GOOGLE_CLIENT_ID,
    //   GOOGLE_SECRET,
    //   GOOGLE_REDIRECT_URI,
    // );

    oauth2Client.getToken(code)
      .then(response => {
        console.log(response.tokens.access_token);
        res.send(getWindowAccessTokenPosterHTML(response.tokens.access_token));
      })
      .catch(err => {
        console.log(err);
        res.send(getWindowErrorPosterHTML('Error while getting the access token'));
      });
  }
};

export default {
  login,
  logged,
};
