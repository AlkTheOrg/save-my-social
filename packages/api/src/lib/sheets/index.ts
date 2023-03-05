import SpotifyWebApi from 'spotify-web-api-node';
import { sheets_v4 } from 'googleapis';
import { FeaturesOfRedditExport, FeaturesOfSpotifyExport, FeaturesOfTwitterExport } from '../../controllers/types.js';
import {
  fetchPlaylistTracks,
  getPlaylist,
  spotifyPlaylistColumnNames,
} from '../spotify/index.js';
import { INITIAL_SHEET_NAME } from '../constants.js';
import { fetchSavedModels as fetchSavedRedditModels, redditSavedModelColumnNames } from '../reddit/index.js';
import { ImportDataIntoSheetResponse } from './types.js';
import { fetchBookmarks as fetchTwitterBookmarks, twitterBookmarkColumnNames } from '../twitter/index.js';

const freezeRowRequest = (frozenRowCount = 1) => ({
  gridProperties: {
    frozenRowCount,
  },
});

export const getSpreadSheet = (sheetsApi: sheets_v4.Sheets, id: string) =>
  sheetsApi.spreadsheets.get({
    spreadsheetId: id,
  });

export const createSpreadSheet = (sheetsApi: sheets_v4.Sheets, title: string) =>
  sheetsApi.spreadsheets.create({
    requestBody: {
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: INITIAL_SHEET_NAME,
            ...freezeRowRequest(),
          },
        },
      ],
    },
  });

export const createNewSheet = (
  sheetsApi: sheets_v4.Sheets,
  title: string,
  spreadsheetId: string,
) =>
  sheetsApi.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title,
              ...freezeRowRequest(),
              // "tabColor": {
              //   "red": 1.0,
              //   "green": 0.3,
              //   "blue": 0.4
              // }
            },
          },
        },
      ],
    },
  });

export const renameSheet = (
  sheetsApi: sheets_v4.Sheets,
  title: string,
  spreadsheetId: string,
  sheetId: number,
) =>
  sheetsApi.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              title,
              sheetId,
            },
            fields: 'title'
          },
        },
      ],
    },
  });

export const importRowsIntoSheet = async (
  sheetsApi: sheets_v4.Sheets,
  data: Array<Array<string | number | boolean>>,
  spreadsheetId: string,
  startingRowNum = 1,
  sheetName?: string,
) => {
  const range = sheetName
    ? `${sheetName}!A${startingRowNum}`
    : `A${startingRowNum}`;
  return sheetsApi.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [...data],
    },
  });
};

export const sheetExists = async (
  sheetsApi: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetName: string,
): Promise<boolean> => {
  const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });
  const sheets = spreadsheet.data.sheets;
  if (!sheets) return false;
  for (const sheet of sheets) {
    if (sheet.properties?.title === sheetName) return true;
  }
  return false;
};

// for now only targets playlist export
export const importSpotifyDataIntoSheet = async (
  sheetsApi: sheets_v4.Sheets,
  spotifyAccessToken: string,
  exportProps: FeaturesOfSpotifyExport,
  spreadsheetId: string,
  lastSheetName: string,
  isImportingForTheFirstTime: boolean,
  firstSheetId: number,
  totalNumOfImportedItems: number, // should be zero if fetching playlist for the first time
): Promise<ImportDataIntoSheetResponse> => {
  const {
    spotify: {
      playlist: { id: playlistId, offset },
    },
  } = exportProps;

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(spotifyAccessToken);

  const {
    body: {
      name: playlistName,
      tracks: { total: totalNumOfTracks },
    },
  } = await getPlaylist(spotifyApi, playlistId);

  const shouldImportColumnData = lastSheetName ? false : true;
  let sheetName = lastSheetName;

  // first time importing this playlist
  if (!offset) {
    if (isImportingForTheFirstTime) {
      // as we create spreadsheet in GoogleController, we rename the default sheet and use it
      await renameSheet(sheetsApi, playlistName, spreadsheetId, firstSheetId);
    } else {
      await createNewSheet(sheetsApi, playlistName, spreadsheetId);
    }
    sheetName = playlistName;
  }

  const { newOffset, tracks, next: _next } = await fetchPlaylistTracks(
    spotifyApi,
    playlistId,
    totalNumOfImportedItems,
  );

  const tracksData = tracks.map(Object.values);
  const data = shouldImportColumnData
    ? [Object.keys(spotifyPlaylistColumnNames), ...tracksData]
    : tracksData;

  await importRowsIntoSheet(
    sheetsApi,
    data,
    spreadsheetId,
    // first time check is to avoid overwriting column data
    totalNumOfImportedItems + 1 + (shouldImportColumnData ? 0 : 1),
    sheetName,
  );
  
  const newExportProps: FeaturesOfSpotifyExport = {
    spotify: {
      playlist: {
        id: playlistId,
        offset: newOffset,
      }
    }
  }

  return ({
    spreadsheetId,
    lastSheetName: sheetName,
    numOfImportedItems: tracks.length,
    newExportProps,
    totalNumOfItems: totalNumOfTracks,
  });
};

export const importRedditDataIntoSheet = async (
  sheetsApi: sheets_v4.Sheets,
  redditAccessToken: string,
  exportProps: FeaturesOfRedditExport,
  spreadsheetId: string,
  isImportingForTheFirstTime: boolean,
  firstSheetId: number,
  totalNumOfImportedItems: number,
): Promise<ImportDataIntoSheetResponse> => {
  const { reddit: { saved: { lastItemID } }} = exportProps;
  
  const { models, lastQueried } = await fetchSavedRedditModels(redditAccessToken, lastItemID);
  const sheetName = 'Saved Models';
  await renameSheet(sheetsApi, sheetName, spreadsheetId, firstSheetId);

  const modelsData = models.map(Object.values);
  const data = isImportingForTheFirstTime
    ? [Object.keys(redditSavedModelColumnNames), ...modelsData]
    : modelsData;

  const newExportProps: FeaturesOfRedditExport = {
    reddit: {
      saved: {
        lastItemID: lastQueried,
      }
    }
  }

  await importRowsIntoSheet(
    sheetsApi,
    data,
    spreadsheetId,
    // first time check is to avoid overwriting column data
    totalNumOfImportedItems + 1 + (isImportingForTheFirstTime ? 0 : 1),
  );

  return ({
    spreadsheetId,
    lastSheetName: sheetName,
    numOfImportedItems: models.length,
    newExportProps,
    totalNumOfItems: -1,
  })
}

export const importTwitterBookmarksToSheet = async (
  sheetsApi: sheets_v4.Sheets,
  twitterAccessToken: string,
  exportProps: FeaturesOfTwitterExport,
  spreadsheetId: string,
  isImportingForTheFirstTime: boolean,
  firstSheetId: number,
  totalNumOfImportedItems: number,
): Promise<ImportDataIntoSheetResponse> => {
  const { twitter: { bookmarks: { paginationToken } }} = exportProps;
  
  // const { models, lastQueried } = await fetchSavedRedditModels(redditAccessToken, lastItemID);
  const { nextToken, resultCount, tweets } = await fetchTwitterBookmarks(twitterAccessToken, paginationToken);
  const sheetName = 'Twitter Bookmarks';
  await renameSheet(sheetsApi, sheetName, spreadsheetId, firstSheetId);

  const modelsData = tweets.map(Object.values);
  const data = isImportingForTheFirstTime
    ? [Object.keys(twitterBookmarkColumnNames), ...modelsData]
    : modelsData;

  const newExportProps: FeaturesOfTwitterExport = {
    twitter: {
      bookmarks: {
        paginationToken: nextToken,
      }
    }
  };

  await importRowsIntoSheet(
    sheetsApi,
    data,
    spreadsheetId,
    // first time check is to avoid overwriting column data
    totalNumOfImportedItems + 1 + (isImportingForTheFirstTime ? 0 : 1),
  );

  return ({
    spreadsheetId,
    lastSheetName: sheetName,
    numOfImportedItems: resultCount,
    newExportProps,
    totalNumOfItems: -1,
  })
}
