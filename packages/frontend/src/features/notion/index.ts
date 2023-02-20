import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeaturesOfSocialAppExport, FeaturesOfSpotifyExport } from "../types";
import { setMessage } from "../../app/smsSlice";
import { ThunkAPI } from "../../app/store";
import { ImportItemsToNotionPayload } from "./endpointTypes";
import {
  fetchAuthURL,
  importItemsToNotion,
} from "./notionApiService";
import { fetchPlaylists } from "../spotify/spotifyApiService";

export const getAuthURL = createAsyncThunk("notion/authURL", async () => {
  const response = await fetchAuthURL();
  return response.data.url;
});

const recursivelyImportToNotion = async (
  exportProps: FeaturesOfSocialAppExport,
  beforeImport: (
    totalFetchedAmount: number,
    totalItemAmount?: number,
    loopIndex?: number,
  ) => void,
  afterImport: () => void,
  totalItemAmount?: number,
  lastEditedDBID = "",
  totalFetchedAmount = 0,
  loopIndex = 1,
  lastEditedPage = "",
): Promise<{ url: string, dbID: string, lastEditedPageId?: string }> => {
  beforeImport(totalFetchedAmount, totalItemAmount, loopIndex);

  const payload: ImportItemsToNotionPayload = {
    lastEditedDBID,
    exportProps,
    lastEditedPageId: lastEditedPage,
  };

  const {
    data: {
      dbURL,
      dbID,
      newExportProps,
      numOfImportedItems,
      totalNumOfItems,
      lastEditedPageId,
    },
  } = await importItemsToNotion(payload);

  afterImport();

  // if (lastQueriedItem)
  if (numOfImportedItems === 100) {
    const res = await recursivelyImportToNotion(
      newExportProps,
      beforeImport,
      afterImport,
      totalNumOfItems > 0 ? totalNumOfItems : undefined,
      dbID,
      totalFetchedAmount + numOfImportedItems,
      loopIndex,
      lastEditedPageId,
    );
    return res;
  }

  return {
    url: dbURL,
    dbID,
    lastEditedPageId,
  };
};

export const importItems = createAsyncThunk<
  string, // return type
  FeaturesOfSocialAppExport, // type of first argument
  ThunkAPI
>(
  "notion/importItems",
  async (initialExportProps, { dispatch }) => {
    const beforeImport = (totalFetchedAmount: number) => dispatch(setMessage(
      `Importing items from ${totalFetchedAmount} to ${totalFetchedAmount + 100}`,
    ));
    const res = await recursivelyImportToNotion(
      initialExportProps,
      beforeImport,
      () => {},
      undefined,
      "",
      0,
      -1, // no multiple recursive calls here
    );

    return res.url;
  },
);

export const importSpotifyPlaylistsToNotion = createAsyncThunk<
  string,
  FeaturesOfSpotifyExport,
  ThunkAPI
>(
  "notion/importSpotifyPlaylistsToNotion",
  async (initialExportProps, { dispatch }) => {
    const { data: playlistIds } = await fetchPlaylists();
    const numOfPlaylists = playlistIds.length;

    const getImportStartedText = (loopIndex = -1) => (loopIndex >= 0
      ? `Importing playlist ${loopIndex + 1}/${numOfPlaylists}`
      : "Started importing tracks");
    const beforeImport = (
      totalFetchedAmount: number,
      totalItemAmount = 0,
      loopIndex = 0,
    ) => {
      const message = totalItemAmount
        ? `Importing tracks ${totalFetchedAmount}/${totalItemAmount} (
            Playlist ${loopIndex + 1}/${numOfPlaylists}
          )`
        : getImportStartedText(loopIndex);
      dispatch(setMessage(message));
    };

    let dbURL = "";
    let lastEditedPageId = "";

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
      const res = await recursivelyImportToNotion(
        exportProps,
        beforeImport,
        () => {},
        undefined,
        "",
        0,
        i,
        lastEditedPageId,
      );
      dbURL = res.url;
      lastEditedPageId = res.lastEditedPageId || "";
    }
    return dbURL;
  },
);
