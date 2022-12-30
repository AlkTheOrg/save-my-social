import axios, { AxiosError, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import {
  concatWithEmptySpace,
  encodeURIOptions,
  getWindowAccessTokenPosterHTML,
  getWindowErrorPosterHTML,
} from '../lib/index.js';
import { fetchSavedModels, getAuthOptions } from '../lib/reddit/index.js';
import { ReqBodyWithItemAfter } from '../lib/reddit/types.js';
import {
  AccessTokenResponse,
  CustomRequest,
  OTTReqOptions,
  ScopeVariables,
} from './types.js';
dotenv.config();
const Axios = axios.default;

const scopeVariables: ScopeVariables = ['save', 'history', 'identity']; // https://www.reddit.com/dev/api/oauth

const { REDDIT_CLIENT_ID, REDDIT_REDIRECT_URI, REDDIT_SECRET, REDDIT_STATE } =
  process.env;

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
};

const login = (_: Request, res: Response) => {
  const url = 'https://www.reddit.com/api/v1/authorize?' + uriEncodedOptions;
  res.redirect(url);
};

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
    const authOptions = getAuthOptions(
      code,
      REDDIT_REDIRECT_URI,
      REDDIT_CLIENT_ID,
      REDDIT_SECRET,
    );

    Axios.post(authOptions.url, encodeURIOptions(authOptions.form), authOptions.axiosConfig)
      .then((response: AxiosResponse<AccessTokenResponse> )=> {
        res.send(getWindowAccessTokenPosterHTML(response.data.access_token));
      })
      .catch((err: AxiosError) => {
        console.log(err);
        res.send(getWindowErrorPosterHTML('Error while getting access token'));
      });
  }
};

const getSavedModels = async (req: CustomRequest<ReqBodyWithItemAfter>, res: Response) => {
  const { accessToken, after } = req.body;
  try {
    const result = await fetchSavedModels(accessToken, after);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
};

// endpoint: https://oauth.reddit.com/api/v1/

export default {
  redirectUrl,
  login,
  logged,
  getSavedModels,
};
