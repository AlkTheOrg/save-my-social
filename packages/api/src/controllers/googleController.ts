import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { CustomRequestWithAT, FeaturesOfRedditExport, FeaturesOfSpotifyExport, ScopeVariables } from '../controllers/types.js';
// import drive from '@googleapis/drive'; //TODO uninstall these packages if there is no way to setCredentials with them
// import sheets from '@googleapis/sheets';
// import youtube from '@googleapis/youtube';
import { google } from "googleapis";
import { getAppExportFeatureKey, getWindowErrorPosterHTML, sendMsgResponse } from './../lib/index.js';
import { getWindowAccessTokenInfoPosterHTML } from '../lib/index.js';
import { ImportDataIntoSheetResponse, ReqBodyWithLastEditedSpreadsheetID } from '../lib/sheets/types.js';
import {
  createSpreadSheet,
  getSpreadSheet,
  importSpotifyDataIntoSheet,
  importRedditDataIntoSheet
} from '../lib/sheets/index.js';
import { appsToExportFrom } from '../lib/constants.js';
import { getAccessToken, setAccessToken } from '../lib/accessTokenManager.js';
dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, GOOGLE_SECRET, GOOGLE_STATE } =
  process.env;
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  GOOGLE_REDIRECT_URI,
);

const redirectUrl = (_: Request, res: Response) => {
  const scopes: ScopeVariables = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/spreadsheets',
  ];
  const url = oauth2Client.generateAuthUrl({
    scope: scopes,
  });
  res.send({ url });
};

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
    res.send(getWindowErrorPosterHTML(error));
    // } else if (state === null) {
    //   console.log('state is missing');
    //   res.send(getWindowErrorPosterHTML('State missing'))
  } else {
    // const oauth2Client = new google.auth.OAuth2(
    //   GOOGLE_CLIENT_ID,
    //   GOOGLE_SECRET,
    //   GOOGLE_REDIRECT_URI,
    // );

    oauth2Client
      .getToken(code)
      .then((response) => {
        setAccessToken('sheets', response.tokens.access_token);
        res.send(getWindowAccessTokenInfoPosterHTML(!!response.tokens.access_token));
      })
      .catch((err) => {
        console.log(err);
        res.send(
          getWindowErrorPosterHTML('Error while getting the access token'),
        );
      });
  }
};

const importItemsToSheets = async (
  req: CustomRequestWithAT<ReqBodyWithLastEditedSpreadsheetID>,
  res: Response,
) => {
  try {
    const { exportProps, lastSpreadsheetID, lastSheetName, totalNumOfImportedItems = 0 } = req.body;
    const accessToken = req.accessToken;
    if (!exportProps || Object.keys(exportProps).length < 1) {
      sendMsgResponse(res, 400, 'One of the required parameters is missing.');
      return;
    }
    
    //* below and above blocks are common with notionController. So move them to utils
    const appName = appsToExportFrom.find(app => app === Object.keys(exportProps)[0]);
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

    oauth2Client.setCredentials({ access_token: accessToken });
    const sheetsApi = google.sheets({ version: "v4", auth: oauth2Client });

    const { data: { spreadsheetId, sheets, spreadsheetUrl }} = lastSpreadsheetID
      ? await getSpreadSheet(sheetsApi, lastSpreadsheetID)
      : await createSpreadSheet(sheetsApi, exportType.toUpperCase());
    const firstSheetId = sheets[0].properties.sheetId;
    
    const isImportingForTheFirstTime = lastSpreadsheetID ? false : true;
    
    let importToSheetsRes = {} as ImportDataIntoSheetResponse;
    
    switch (appName) {
      case 'spotify': {
        importToSheetsRes = await importSpotifyDataIntoSheet(
          sheetsApi,
          accessTokenSocial,
          exportProps as FeaturesOfSpotifyExport,
          spreadsheetId,
          lastSheetName,
          isImportingForTheFirstTime,
          firstSheetId,
          totalNumOfImportedItems
        );
        break;
      }
      
      case 'reddit': {
        importToSheetsRes = await importRedditDataIntoSheet(
          sheetsApi,
          accessTokenSocial,
          exportProps as FeaturesOfRedditExport,
          spreadsheetId,
          isImportingForTheFirstTime,
          firstSheetId,
          totalNumOfImportedItems
        );
        break;
      }

      default:
        sendMsgResponse(res, 401, 'Invalid social app.');
        return;
    }
    // if (numOfImportedItems < 100)
    //   updateDBTitle(notion, `${appName} ${featureKey} - Completed`, db.id);
    res.send(importToSheetsRes);
  } catch (err) {
    console.log(err);
    res.status(404).send('something went wrong');
  }
};

export default {
  redirectUrl,
  login,
  logged,
  importItemsToSheets,
};
