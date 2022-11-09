import axios, { AxiosError, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { Client } from "@notionhq/client";
import { encodeURIOptions } from '../lib/index.js';
import {
  AccessTokenReqConfig,
  AccessTokenResponse,
  OTTReqNotionOptions,
} from './types.js';
import { getLastEditedPage } from '../lib/notion/index.js';
dotenv.config();
const Axios = axios.default;

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
    res.status(404).send({ msg: 'State missing' });
  } else if (state !== NOTION_STATE) {
    res.status(404).send({ msg: 'Invalid state' });
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
        res.status(404).send({ msg: 'Invalid request' });
      });
  }
};

const lastEditedPageID = async (req: Request, res: Response) => {
  const accessToken = req.query.access_token as string;
  const notion = new Client({ auth: accessToken });

  try {
    const lastEditedPage = await getLastEditedPage(notion);
    if (!lastEditedPage) res.status(404).send({ msg: "You need to give access to at least one notion page." });
    else res.send({ id: lastEditedPage.id });
  } catch(err) {
    console.log(err);
    if (err.code && err.code === "unauthorized") {
      res.status(401).send({ msg: "API token is invalid." }); //TODO this is an assumption. Parse the real message from the response
    } else {
      res.status(404).send({ msg: "Something bad happened." });
    }
}
}; 

export default {
  login,
  logged,
  lastEditedPageID,
}
