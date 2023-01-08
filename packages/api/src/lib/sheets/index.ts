import { sheets_v4 } from 'googleapis';
import { FeaturesOfSpotifyExport } from '../../controllers/types.js';
import {
  fetchPlaylistTracks,
  spotifyPlaylistColumnNames,
} from '../spotify/index.js';

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
            title,
            ...freezeRowRequest()
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
  sheetsApi.spreadsheets.values.update({
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
  for (const sheet of sheets) {
    if (sheet.properties.title === sheetName) return true;
  }
  return false;
};

// const getTextFormatRequest = (
//   fontColor,
//   startRowIndex,
//   endRowIndex,
//   startColumnIndex,
//   endColumnIndex,
//   isBold = true
// ) => ({
//   repeatCell: {
//     range: {
//       startRowIndex,
//       endRowIndex,
//       startColumnIndex,
//       endColumnIndex,
//     },
//     cell: {
//       userEnteredFormat: {
//         textFormat: {
//           bold: isBold,
//           foregroundColor: {
//             red: fontColor[0],
//             green: fontColor[1],
//             blue: fontColor[2],
//           },
//         },
//       },
//     },
//     fields: "userEnteredFormat(textFormat)",
//   },
// });

// for now only targets playlist export
export const importSpotifyDataIntoSheet = async (
  sheetsApi: sheets_v4.Sheets,
  spotifyAccessToken: string,
  exportProps: FeaturesOfSpotifyExport,
  spreadsheetID: string,
  title2: string, // TODO use this
): Promise<[number, string]> => {
  const {
    spotify: {
      playlist: { id, lastTrackID },
    },
  } = exportProps;
  const title = "test sheet";
  if (!lastTrackID) {
    // first time importing this playlist
    await createNewSheet(sheetsApi, title, spreadsheetID);
    await importRowsIntoSheet(
      sheetsApi,
      [Object.keys(spotifyPlaylistColumnNames)],
      spreadsheetID,
      1,
      title,
    );
    console.log('imported rows into the sheet');
  }

  const { lastQueried, tracks } = await fetchPlaylistTracks(
    spotifyAccessToken,
    id,
  );
  await importRowsIntoSheet(
    sheetsApi,
    tracks.map(Object.values),
    spreadsheetID,
    2,
    title,
  );

  return [tracks.length, lastQueried];
};
