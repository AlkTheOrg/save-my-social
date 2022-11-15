import axios, { AxiosError, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { concatWithEmptySpace, encodeURIOptions, getWindowAccessTokenPosterHTML, getWindowErrorPosterHTML, getWindowMessagePosterHTML } from '../lib/index.js';
import { fetchSavedModels } from '../lib/reddit/index.js';
import { AccessTokenReqConfig, AccessTokenResponse, OTTReqOptions, ScopeVariables } from './types.js';
dotenv.config();
const Axios = axios.default;

const scopeVariables: ScopeVariables = ["save", "history", "identity"]; // https://www.reddit.com/dev/api/oauth

const {
  REDDIT_CLIENT_ID,
  REDDIT_REDIRECT_URI,
  REDDIT_SECRET,
  REDDIT_STATE,
} = process.env;

const options: OTTReqOptions = {
  client_id: REDDIT_CLIENT_ID,
  redirect_uri: REDDIT_REDIRECT_URI,
  scope: scopeVariables.reduce(concatWithEmptySpace),
  response_type: 'code',
  show_dialog: 'true',
  state: REDDIT_STATE,
};

const uriEncodedOptions = encodeURIOptions(options);

const redirectUrl = (_: Request, res: Response) => {
  const url = `https://www.reddit.com/api/v1/authorize?${uriEncodedOptions}`;
  res.send({ url });
}

const login = (_: Request, res: Response) => {
  const url =
    'https://www.reddit.com/api/v1/authorize?' + uriEncodedOptions;
  res.redirect(url);
}

const logged = async (req: Request, res: Response) => {
  const code = (req.query.code as string) || null;
  const state = (req.query.state as string) || null;
  const error = (req.query.error as string) || null;

  if (error) {
    console.log(error);
    res.send(getWindowErrorPosterHTML(error));
  } else if (state === null) {
    console.log('State missing');
    res.send(getWindowErrorPosterHTML('State missing'));
  } else if (state !== REDDIT_STATE) {
    console.log('Invalid state');
    res.send(getWindowErrorPosterHTML('Invalid state'));
  } else {
    const authOptions: AccessTokenReqConfig = {
      url: 'https://www.reddit.com/api/v1/access_token',
      form: {
        code,
        redirect_uri: REDDIT_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      axiosConfig: {
        headers: {
          Accept: 'application/json',
          Authorization: 'Basic ' + Buffer.from(REDDIT_CLIENT_ID + ':' + REDDIT_SECRET).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    };

    await Axios.post(authOptions.url, encodeURIOptions(authOptions.form), authOptions.axiosConfig)
      .then((response: AxiosResponse<AccessTokenResponse> )=> {
        res.send(getWindowAccessTokenPosterHTML(response.data.access_token));
      }
      ).catch((err: AxiosError) => {
        console.log(err);
        res.send(getWindowMessagePosterHTML({
          error: 'Error while getting access token',
          source: 'save-my-social',
          type: 'error',
        }));
      })
  }
}

const getSavedModels = async (req: Request, res: Response) => {
  const accessToken = req.query.accessToken as string;
  const after = req.query.after as string | undefined; // last queried item
  try {
    const result = await fetchSavedModels(accessToken, after);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
};

// endpoint: https://oauth.reddit.com/api/v1/

export default {
  redirectUrl,
  login,
  logged,
  getSavedModels
}
