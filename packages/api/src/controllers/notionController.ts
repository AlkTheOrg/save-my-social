import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import axios, { AxiosResponse, AxiosError } from 'axios';
const Axios = axios.default;
import { encodeURIOptions } from '../lib/index.js';
import {
  AccessTokenReqConfig,
  AccessTokenResponse,
  OTTReqNotionOptions,
} from './types.js';

const { NOTION_CLIENT_ID, NOTION_REDIRECT_URI, NOTION_SECRET, NOTION_STATE } =
  process.env;

const options: OTTReqNotionOptions = {
  client_id: NOTION_CLIENT_ID,
  redirect_uri: NOTION_REDIRECT_URI,
  response_type: 'code',
  owner: 'user',
  show_dialog: 'true',
  state: NOTION_STATE,
};

const login = (_: Request, res: Response) => {
  const url =
    'https://api.notion.com/v1/oauth/authorize?' +
    encodeURIOptions({ ...options });
  res.redirect(url);
};

const logged = async (req: Request, res: Response) => {
  const code = req.query.code as string || null;
  const state = req.query.state as string || null;
  const error = req.query.error as string || null;

  if (error) {
    res.status(404).send({ error });
  } else if (state === null) {
    // res.redirect('/#' + new URLSearchParams({ error: 'state_missing' }));
    res.status(404).send({ error: 'State missing' });
  } else if (state !== NOTION_STATE) {
    res.status(404).send({ error: 'Invalid state' });
  } else {
    const authOptions: AccessTokenReqConfig = {
      url: "https://api.notion.com/v1/oauth/token",
      form: {
        code,
        redirect_uri: NOTION_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      axiosConfig: {
        headers: {
          Authorization:
            "Basic " + Buffer.from(NOTION_CLIENT_ID + ":" + NOTION_SECRET).toString("base64"),
          "Content-Type": "application/json",
        }
      }
    };

    await Axios.post(
      authOptions.url,
      authOptions.form,
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
}

export default {
  login,
  logged
}
