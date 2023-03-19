import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { setMessage } from "../../app/smsSlice";
import { ThunkAPI } from "../../app/store";
import { getImportStartedText } from "../spotify";
import { fetchPlaylists } from "../spotify/spotifyApiService";
import { FeaturesOfSocialAppExport, FeaturesOfSpotifyExport } from "../types";
import { importItemsToSheets } from "./sheetApiService";

const recursivelyImportToSheets = async (
  exportProps: FeaturesOfSocialAppExport,
  beforeImport: (
    totalFetchedAmount: number,
    totalItemAmount?: number,
    loopIndex?: number,
  ) => void,
  afterImport: () => void,
  totalItemAmount?: number,
  lastSpreadsheetID = "",
  lastSheetName = "",
  totalFetchedAmount = 0,
  loopIndex = 1,
): Promise<{ url: string, spreadsheetId: string }> => {
  beforeImport(totalFetchedAmount, totalItemAmount, loopIndex);

  const payload = {
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
      totalNumOfItems,
    },
  } = await importItemsToSheets(payload);

  afterImport();

  // if (lastQueriedItem)
  if (numOfImportedItems === 100) {
    const res = await recursivelyImportToSheets(
      newExportProps,
      beforeImport,
      afterImport,
      totalNumOfItems > 0 ? totalNumOfItems : undefined,
      spreadsheetId,
      newLastSheetName,
      totalFetchedAmount + numOfImportedItems,
      loopIndex,
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
  async (initialExportProps, { dispatch, rejectWithValue }) => {
    const beforeImport = (totalFetchedAmount: number) => dispatch(setMessage(
      `Importing items from ${totalFetchedAmount} to ${totalFetchedAmount + 100}`,
    ));

    try {
      const res = await recursivelyImportToSheets(
        initialExportProps,
        beforeImport,
        () => {},
        undefined,
        "",
        "",
        0,
        -1, // no multiple recursive calls here
      );

      return res.url;
    } catch (_err) {
      const error = _err as AxiosError;
      return rejectWithValue({
        msg: (error.response?.data as { msg: string })?.msg || error.message,
      });
    }
  },
);

export const importSpotifyPlaylistsToSheets = createAsyncThunk<
  string,
  FeaturesOfSpotifyExport,
  ThunkAPI
>(
  "sheets/importSpotifyPlaylistsToSheets",
  async (initialExportProps, { dispatch, rejectWithValue }) => {
    const { data: playlistIds } = await fetchPlaylists();
    const numOfPlaylists = playlistIds.length;

    const beforeImport = (
      totalFetchedAmount: number,
      totalItemAmount = 0,
      loopIndex = 0,
    ) => {
      const message = totalItemAmount
        ? `Importing tracks ${totalFetchedAmount}/${totalItemAmount} (
            Playlist ${loopIndex + 1}/${numOfPlaylists}
          )`
        : getImportStartedText(numOfPlaylists, loopIndex);
      dispatch(setMessage(message));
    };

    let spreadsheetURL = "";
    let lastSpreadsheetID = "";
    try {
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
          exportProps,
          beforeImport,
          () => {},
          undefined,
          lastSpreadsheetID,
          "",
          0,
          i,
        );
        spreadsheetURL = res.url;
        lastSpreadsheetID = res.spreadsheetId;
      }
      return spreadsheetURL;
    } catch (_err) {
      const error = _err as AxiosError;
      return rejectWithValue({
        msg: (error.response?.data as { msg: string })?.msg || error.message,
      });
    }
  },
);
