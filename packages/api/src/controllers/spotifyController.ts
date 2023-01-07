import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';
dotenv.config();
import axios, { AxiosResponse, AxiosError } from 'axios';
const Axios = axios.default;
import { Request, Response } from 'express';
import { concatWithEmptySpace, encodeURIOptions } from '../lib/index.js';
import { getPlaylistIDs } from '../lib/spotify/index.js';
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
  'user-top-read',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
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
    res.status(404).send({ error });
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

    await Axios.post(
      authOptions.url,
      encodeURIOptions(authOptions.form),
      authOptions.axiosConfig,
    )
      .then((response: AxiosResponse<AccessTokenResponse>) => {
        res.send({ access_token: response.data.access_token });
      })
      .catch((error: AxiosError) => {
        console.log(error);
        res.status(404).send({ error: 'Invalid request' });
      });
  }
};

const playlists = async (req: Request, res: Response) => {
  const { accessToken } = req.body;
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);
  await getPlaylistIDs(spotifyApi)
    .then(ids => res.send(ids))
    .catch(err => res.status(err.status || 500).send(err));
};

export default { login, logged, playlists };
