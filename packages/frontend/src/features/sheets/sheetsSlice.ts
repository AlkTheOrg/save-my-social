import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setMessage } from "../../app/smsSlice";
import { ThunkAPI } from "../../app/store";
import { fetchPlaylists } from "../spotify/spotifyApiService";
import { FeaturesOfSocialAppExport, FeaturesOfSpotifyExport } from "../types";
import { fetchAuthURL, importItemsToSheets } from "./sheetApiService";

const initialState: { name: string } = {
  name: "sheets",
};

export const getAuthURL = createAsyncThunk("sheets/authURL", async () => {
  const response = await fetchAuthURL();
  return response.data.url;
});

const recursivelyImportToSheets = async (
  accessTokenToExport: string,
  accessTokenToImport: string,
  exportProps: FeaturesOfSocialAppExport,
  beforeImport: (totalFetchedAmount: number) => void,
  afterImport: (totalFetchedAmount: number, numOfImportedItems: number) => void,
  lastSpreadsheetID = "",
  lastSheetName = "",
  totalFetchedAmount = 0,
): Promise<{ url: string, spreadsheetId: string }> => {
  beforeImport(totalFetchedAmount);

  const payload = {
    accessToken: accessTokenToImport,
    accessTokenSocial: accessTokenToExport,
    exportProps,
    lastSpreadsheetID,
    lastSheetName,
    totalNumOfImportedItems: totalFetchedAmount,
  };

  const {
    data: {
      lastSheetName: newLastSheetName,
      newExportProps,
      numOfImportedItems,
      spreadsheetId,
      // totalNumOfItems, // TODO: If not -1, use while setting the redux msg
    },
  } = await importItemsToSheets(payload);

  afterImport(totalFetchedAmount, numOfImportedItems);

  // if (lastQueriedItem)
  if (numOfImportedItems === 100) {
    const res = await recursivelyImportToSheets(
      accessTokenToExport,
      accessTokenToImport,
      newExportProps,
      beforeImport,
      afterImport,
      spreadsheetId,
      newLastSheetName,
      totalFetchedAmount + numOfImportedItems,
    );
    return res;
  }

  return {
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    spreadsheetId,
  };
};

export const importItems = createAsyncThunk<
  string, // return type
  FeaturesOfSocialAppExport,
  ThunkAPI
>(
  "sheets/importItems",
  async (initialExportProps, { getState, dispatch }) => {
    const {
      sms: {
        tokens: [toExport, toImport],
      },
    } = getState();

    const beforeImport = (totalFetchedAmount: number) => dispatch(setMessage(
      `Importing items from ${totalFetchedAmount} to ${totalFetchedAmount + 100}`,
    ));
    const afterImport = (totalFetchedAmount: number, numOfImportedItems: number) =>
      dispatch(setMessage(
        `Successfully imported items from ${totalFetchedAmount} to ${
          totalFetchedAmount + numOfImportedItems
        }`,
      ));

    const res = await recursivelyImportToSheets(
      toExport,
      toImport,
      initialExportProps,
      beforeImport,
      afterImport,
      "",
      "",
    );

    return res.url;
  },
);

export const importSpotifyPlaylistsToSheets = createAsyncThunk<
  string,
  FeaturesOfSpotifyExport,
  ThunkAPI
>(
  "sheets/importSpotifyPlaylistsToSheets",
  async (initialExportProps, { getState, dispatch }) => {
    const {
      sms: {
        tokens: [toExport, toImport],
      },
    } = getState();

    const { data: playlistIds } = await fetchPlaylists(toExport);

    const beforeImport = (totalFetchedAmount: number) => dispatch(setMessage(
      `Importing items from ${totalFetchedAmount} to ${totalFetchedAmount + 100}`,
    ));
    const afterImport = (totalFetchedAmount: number, numOfImportedItems: number) =>
      dispatch(setMessage(
        `Successfully imported items from ${totalFetchedAmount} to ${
          totalFetchedAmount + numOfImportedItems
        }`,
      ));

    let spreadsheetURL = "";
    let lastSpreadsheetID = "";
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < playlistIds.length; i++) {
      const id = playlistIds[i];
      const exportProps: FeaturesOfSpotifyExport = {
        spotify: {
          playlist: {
            ...initialExportProps.spotify.playlist,
            id,
          },
        },
      };

      // eslint-disable-next-line no-await-in-loop
      const res = await recursivelyImportToSheets(
        toExport,
        toImport,
        exportProps,
        beforeImport,
        afterImport,
        lastSpreadsheetID,
        "",
      );
      spreadsheetURL = res.url;
      lastSpreadsheetID = res.spreadsheetId;
    }
    return spreadsheetURL;
  },
);

export const sheetsSlice = createSlice({
  name: "sheets",
  initialState,
  reducers: {},
});

export default sheetsSlice.reducer;
