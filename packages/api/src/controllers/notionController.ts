import axios, { AxiosError, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { Client } from '@notionhq/client';
import {
  encodeURIOptions,
  getAppExportFeatureKey,
  getWindowAccessTokenPosterHTML,
  getWindowErrorPosterHTML,
  sendMsgResponse,
} from '../lib/index.js';
import {
  AccessTokenResponse,
  CustomRequest,
  FeaturesOfRedditExport,
  OTTReqNotionOptions,
} from './types.js';
import {
  createDB,
  createPagesFromRedditExportProps,
  getAuthOptions,
  getLastEditedPage,
  retrieveDB,
  updateDBTitle,
} from '../lib/notion/index.js';
import {
  CreateDBPropArguments,
  ReqBodyWithLastEditedPageID as ImportItemsToNotionReqBody,
} from '../lib/notion/types.js';
import { appsToExportFrom } from '../lib/constants.js';
import { socialAppToDBPropsMapping } from '../lib/notion/dbCreator.js';
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

const redirectUrl = (_: Request, res: Response) => {
  const url =
    'https://api.notion.com/v1/oauth/authorize?' +
    encodeURIOptions({ ...options });
  res.send({ url });
};

const login = (_: Request, res: Response) => {
  const url =
    'https://api.notion.com/v1/oauth/authorize?' +
    encodeURIOptions({ ...options });
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
    res.status(404).send({ msg: 'State missing' });
  } else if (state !== NOTION_STATE) {
    res.status(404).send({ msg: 'Invalid state' });
  } else {
    const authOptions = getAuthOptions(
      code,
      NOTION_REDIRECT_URI,
      NOTION_CLIENT_ID,
      NOTION_SECRET,
    );

    Axios.post(authOptions.url, authOptions.form, authOptions.axiosConfig)
    .then((response: AxiosResponse<AccessTokenResponse>) => {
      res.send(getWindowAccessTokenPosterHTML(response.data.access_token));
    })
      .catch((error: AxiosError) => {
        console.log(error);
        res.send(getWindowErrorPosterHTML('Error while getting access token'));
      });
  }
};

const importItems = async (
  req: CustomRequest<ImportItemsToNotionReqBody>,
  res: Response,
) => {
  try {
    const { lastEditedDBID, accessToken, accessTokenSocial, exportProps } = req.body;
    if (!accessTokenSocial || !exportProps || Object.keys(exportProps).length < 1) {
      sendMsgResponse(res, 400, 'One of the required parameters is missing.');
      return;
    }
    const notion = new Client({ auth: accessToken });

    // get the type of the exported app (reddit, twitter etc.)
    const appName = appsToExportFrom.find((app) => app === Object.keys(exportProps)[0]);
    if (!appName) {
      sendMsgResponse(res, 400, 'Invalid app name... bruh...');
      return;
    }

    const featureKey = getAppExportFeatureKey(exportProps, appName);
    const exportType = `${appName}_${featureKey}`;

    // get the socialAppToDBProp mapping value
    const appDBProps = socialAppToDBPropsMapping[appName][exportType];
    if (!appDBProps) {
      sendMsgResponse(res, 400, `"${featureKey}" is an invalid feature to export from "${appName}".`);
      return;
    }

    let db;
    // set DB
    if (lastEditedDBID) {
      db = await retrieveDB(notion, lastEditedDBID);
    } else {
      // get the last edited page and create a new db
      const lastEditedPage = await getLastEditedPage(notion);
      if (!lastEditedPage) {
        sendMsgResponse(res, 404, 'You need to give access to at least one notion page.');
        return;
      }
      db = await createDB(
        notion,
        lastEditedPage.id,
        `${appName} ${featureKey} - Import In Proggress`,
        appDBProps.properties as Array<CreateDBPropArguments>,
      );
    }

    let lastQueriedItem = '';
    let numOfImportedItems = 0;
    switch (appName) {
      case 'reddit': {
        [numOfImportedItems, lastQueriedItem] =
          await createPagesFromRedditExportProps(
            notion,
            accessTokenSocial,
            db.id,
            exportProps as FeaturesOfRedditExport,
          );
        break;
      }

      default:
        sendMsgResponse(res, 401, 'Invalid social app.');
        return;
    }

    if (numOfImportedItems < 100)
      updateDBTitle(notion, `${appName} ${featureKey} - Completed`, db.id);

    res.send({
      dbURL: db.url,
      dbID: db.id,
      numOfImportedItems,
      lastQueriedItem,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).send(err);
  }
};

export default {
  redirectUrl,
  login,
  logged,
  importItems,
};
