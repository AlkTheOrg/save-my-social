import dotenv from 'dotenv';
dotenv.config();
import axios, { AxiosResponse, AxiosError } from 'axios';
const Axios = axios.default;
import { Request, Response } from 'express';
import { concatWithEmptySpace, encodeURIOptions } from '../lib/index.js';
import { 
  AccessTokenReqConfig,
  AccessTokenResponse,
  OTTReqOptions,
  ScopeVariables,
} from './types.js';

const scopeVariables: ScopeVariables = [
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
];

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SECRET,
  SPOTIFY_STATE,
} = process.env;

const options: OTTReqOptions = {
  client_id: SPOTIFY_CLIENT_ID,
  redirect_uri: SPOTIFY_REDIRECT_URI,
  scope: scopeVariables.reduce(concatWithEmptySpace),
  response_type: 'code',
  show_dialog: 'true',
  state: SPOTIFY_STATE,
};

const login = (_: Request, res: Response) => {
  const url =
    'https://accounts.spotify.com/authorize?' + encodeURIOptions(options);
  res.redirect(url);
};

const logged = async (req: Request, res: Response) => {
  const code = (req.query.code as string) || null;
  const state = (req.query.state as string) || null;
  const error = (req.query.error as string) || null;

  if (error) {
    res.status(404).send(error);
  } else if (state === null) {
    // res.redirect('/#' + new URLSearchParams({ error: 'state_missing' }));
    res.status(404).send({ error: 'State missing' });
  } else if (state !== SPOTIFY_STATE) {
    res.status(404).send({ error: 'Invalid state' });
  } else {
    const authOptions: AccessTokenReqConfig = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      axiosConfig: {
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    };

    await Axios.post<AccessTokenResponse>(
      authOptions.url,
      encodeURIOptions(authOptions.form),
      authOptions.axiosConfig,
    )
      .then((response: AxiosResponse) => {
        res.send({ access_token: response.data.access_token });
      })
      .catch((error: AxiosError) => {
        console.log(error);
        res.status(404).send({ error: 'Invalid request' });
      });
  }
};

// for testing the oauth flow
const playlists = async (req: Request, res: Response) => {
  const { access_token } = req.query;
  const url = 'https://api.spotify.com/v1/me/playlists';
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  await Axios.get(url, { headers })
    .then((response: AxiosResponse) => {
      res.send(response.data.items);
    })
    .catch((error: AxiosError) => {
      res.status(404).send(error);
    });
};

export default { login, logged, playlists };
