import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';
dotenv.config();
import { default as axios, AxiosResponse, AxiosError } from 'axios';
import { Request, Response } from 'express';
import { concatWithEmptySpace, encodeURIOptions, getWindowAccessTokenPosterHTML, getWindowErrorPosterHTML } from '../lib/index.js';
import { fetchPlaylistTracks, getPlaylistIDs } from '../lib/spotify/index.js';
import { 
  AccessTokenReqConfig,
  AccessTokenResponse,
  CustomRequestWithAT,
  OTTReqOptions,
  ScopeVariables,
  ReqBodyOfGetPlaylistTracks,
} from './types.js';
import { setAccessToken } from '../lib/accessTokenManager.js';

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

const redirectUrl = (_: Request, res: Response) => {
  const url =
    'https://accounts.spotify.com/authorize?' + encodeURIOptions(options);
  res.send({ url });
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

    await axios.post(
      authOptions.url,
      encodeURIOptions(authOptions.form),
      authOptions.axiosConfig,
    )
      .then((response: AxiosResponse<AccessTokenResponse>) => {
        // TODO
        setAccessToken('spotify', response.data.access_token);
        res.send(getWindowAccessTokenPosterHTML(response.data.access_token));
      })
      .catch((error: AxiosError) => {
        console.log(error);
        res.send(getWindowErrorPosterHTML('Error while getting access token'));
      });
  }
};

const playlists = async (req: CustomRequestWithAT<{}>, res: Response) => {
  const accessToken = req.accessToken;
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);
  await getPlaylistIDs(spotifyApi)
    .then(ids => res.send(ids))
    .catch(err => res.status(err.status || 500).send(err));
};

const getPlaylistTracks = async (req: CustomRequestWithAT<ReqBodyOfGetPlaylistTracks>, res: Response) => {
  const { playlistId, offset = 0 } = req.body;
  const accessToken = req.accessToken;
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);
  await fetchPlaylistTracks(
      spotifyApi,
      playlistId,
      offset,
  )
  .then(tracks => res.send(tracks))
  .catch(err => res.status(err.status || 500).send(err));
};

export default { login, logged, playlists, redirectUrl, getPlaylistTracks };
