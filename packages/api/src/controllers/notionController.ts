import { createPagesFromTwitterExportProps, retrievePage } from './../lib/notion/index.js';
import { getAccessToken, setAccessToken } from './../lib/accessTokenManager.js';
import { default as axios, AxiosError, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { Client } from '@notionhq/client';
import {
  encodeURIOptions,
  errorHasStatusProperty,
  getAppExportFeatureKey,
  getWindowAccessTokenInfoPosterHTML,
  getWindowErrorPosterHTML,
  sendMsgResponse,
} from '../lib/index.js';
import {
  AccessTokenResponse,
  CustomRequestWithAT,
  ExportFrom,
  FeaturesOfRedditExport,
  FeaturesOfSpotifyExport,
  FeaturesOfTwitterExport,
  OTTReqNotionOptions,
} from './types.js';
import {
  createDB,
  createPagesFromRedditExportProps,
  createPagesFromSpotifyExportProps,
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

const { NOTION_CLIENT_ID, NOTION_REDIRECT_URI, NOTION_SECRET, NOTION_STATE } =
  process.env;

const options: OTTReqNotionOptions = {
  client_id: NOTION_CLIENT_ID as string,
  redirect_uri: NOTION_REDIRECT_URI as string,
  response_type: 'code',
  owner: 'user',
  show_dialog: 'true',
  state: NOTION_STATE as string,
};

export const generateNotionRedirectUrl = () => {
  return 'https://api.notion.com/v1/oauth/authorize?' + encodeURIOptions({ ...options });
};

const redirectUrl = (_: Request, res: Response) => {
  res.send({ url: generateNotionRedirectUrl() });
};

const login = (_: Request, res: Response) => {
  const url =
    'https://api.notion.com/v1/oauth/authorize?' +
    encodeURIOptions({ ...options });
  res.redirect(url);
};

const logged = async (req: Request, res: Response) => {
  const code = (req.query.code as string) || '';
  const state = (req.query.state as string) || null;
  const error = (req.query.error as string) || null;

  if (error) {
    console.log(error);
    res.send(getWindowErrorPosterHTML(error));
  } else if (state === null || state !== NOTION_STATE) {
    res.send(getWindowErrorPosterHTML(`Your NOTION_STATE token is not same with '${state}'`));
  } else {
    const authOptions = getAuthOptions(
      code,
      NOTION_REDIRECT_URI as string,
      NOTION_CLIENT_ID as string,
      NOTION_SECRET as string,
    );

    axios.post(authOptions.url, authOptions.form, authOptions.axiosConfig)
    .then((response: AxiosResponse<AccessTokenResponse>) => {
      if (response.status >= 300) {
        res.send(getWindowErrorPosterHTML('Error while getting access token. Status: ' + response.status));
      } else {
        setAccessToken('notion', response.data.access_token);
        res.send(getWindowAccessTokenInfoPosterHTML(!!response.data.access_token));
      }
    })
      .catch((error: AxiosError) => {
        console.log(error);
        res.send(getWindowErrorPosterHTML('Error while getting access token'));
      });
  }
};

const importItems = async (
  req: CustomRequestWithAT<ImportItemsToNotionReqBody>,
  res: Response,
) => {
  try {
    const { lastEditedDBID, exportProps } = req.body;
    let lastEditedPageId = req.body.lastEditedPageId;
    const accessToken = req.accessToken;
    if (!exportProps || Object.keys(exportProps).length < 1) {
      sendMsgResponse(res, 400, 'One of the required parameters is missing.');
      return;
    }
    const notion = new Client({ auth: accessToken });

    // get the type of the exported app (reddit, spotify etc.)
    const appName = appsToExportFrom.find((app) => app === Object.keys(exportProps)[0]);
    if (!appName) {
      sendMsgResponse(res, 400, 'Invalid app name... bruh...');
      return;
    }
    const accessTokenSocial = getAccessToken(appName);
    if (!accessTokenSocial) {
      sendMsgResponse(res, 400, `Access token for ${appName} is not found.`);
      return;
    }

    const featureKey = getAppExportFeatureKey(exportProps, appName);
    const exportType = `${appName}_${featureKey}`;

    // get the socialAppToDBProp mapping value
    const appDBProps = socialAppToDBPropsMapping[appName as ExportFrom][exportType];
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
      const lastEditedPage = lastEditedPageId
        ? await retrievePage(notion, lastEditedPageId)
        : await getLastEditedPage(notion);
      lastEditedPageId = lastEditedPage.id;
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

    const response = {
      dbID: db.id,
      dbURL: db.url,
      numOfImportedItems: 0,
      newExportProps: {},
      totalNumOfItems: -1, // -1 means unknown
    };

    // each row in a Notion db is a Page in Notion. Hence the function names are plural
    switch (appName) {
      case 'reddit': {
        const { newExportProps, numOfImportedItems } =
          await createPagesFromRedditExportProps(
            notion,
            accessTokenSocial,
            db.id,
            exportProps as FeaturesOfRedditExport,
          );
        response.newExportProps = newExportProps;
        response.numOfImportedItems = numOfImportedItems;
        if (numOfImportedItems < 100)
          updateDBTitle(notion, `${appName} ${featureKey} - Completed`, db.id);
        break;
      }

      case 'spotify': {
        const { newExportProps, numOfImportedItems, playlistName, totalNumOfTracks } =
          await createPagesFromSpotifyExportProps(
            notion,
            accessTokenSocial,
            db.id,
            exportProps as FeaturesOfSpotifyExport,
          );
        response.newExportProps = newExportProps;
        response.numOfImportedItems = numOfImportedItems;
        response.totalNumOfItems = totalNumOfTracks;
        if (numOfImportedItems < 100) {
          updateDBTitle(notion, playlistName, db.id);
        }
        break;
      }

      case 'twitter': {
        const { newExportProps, numOfImportedItems } =
          await createPagesFromTwitterExportProps(
            notion,
            accessTokenSocial,
            db.id,
            exportProps as FeaturesOfTwitterExport,
          );
        response.newExportProps = newExportProps;
        response.numOfImportedItems = numOfImportedItems;
        if (numOfImportedItems < 100)
          updateDBTitle(notion, `${appName} ${featureKey} - Completed`, db.id);
        break;
      }

      default:
        sendMsgResponse(res, 401, 'Invalid social app.');
        return;
    }

    res.send({
      dbURL: response.dbURL,
      dbID: response.dbID,
      numOfImportedItems: response.numOfImportedItems,
      newExportProps: response.newExportProps,
      totalNumOfItems: response.totalNumOfItems,
      lastEditedPageId,
    });
  } catch (err) {
    console.log(err);
    if (errorHasStatusProperty(err)) {
      res.status((err as { status: number }).status || 500).send(err);
    }
    res.status(500).send(err);
  }
};

export default {
  redirectUrl,
  login,
  logged,
  importItems,
};
