import { AsyncThunkAction } from "@reduxjs/toolkit";
import { ExportFrom, ExportTo } from "../app/smsSlice";
import { ThunkAPI } from "../app/store";
import {
  importItems as importItemsToNotion,
  importSpotifyPlaylistsToNotion,
} from "../features/notion/notionSlice";
import {
  importItems as importItemsToSheets,
  importSpotifyPlaylistsToSheets,
} from "../features/sheets/sheetsSlice";
import { getSavedModels } from "../features/reddit/redditSlice";
import { getPlaylists } from "../features/spotify/spotifySlice";
import { GetSavedModelsThunkResponse } from "../features/reddit/types";
import { FeaturesOfSocialAppExport, FeaturesOfSpotifyExport } from "../features/types";

export type GenuineExportFrom = Exclude<ExportFrom, "">;
export type GenuineExportTo = Exclude<ExportTo, "">;

const appToDownloadToLocal = {
  reddit: getSavedModels,
  spotify: getPlaylists,
  twitter: getSavedModels, // TODO only for linters until the implementation is done
  youtube: getSavedModels,
};

const getDownloadThunk = (appType: GenuineExportFrom) =>
  appToDownloadToLocal[appType];

export const getExportThunkAction = (
  exportFrom: GenuineExportFrom,
  exportTo: GenuineExportTo,
  initialExportProps: FeaturesOfSocialAppExport,
): AsyncThunkAction<
  GetSavedModelsThunkResponse | string,
  FeaturesOfSocialAppExport | void,
  ThunkAPI
> => {
  if (exportTo === "download") return getDownloadThunk(exportFrom)();
  if (exportTo === "sheets") {
    if (exportFrom === "spotify") {
      return importSpotifyPlaylistsToSheets(
        initialExportProps as FeaturesOfSpotifyExport,
      );
    }
    return importItemsToSheets(initialExportProps);
  }
  // TODO: Whenn all exports are supported, abstract here to a mapping obj
  if (exportTo === "notion" && exportFrom === "spotify") {
    return importSpotifyPlaylistsToNotion(
      initialExportProps as FeaturesOfSpotifyExport,
    );
  }
  // exportTo === "notion"
  return importItemsToNotion(initialExportProps);
};
