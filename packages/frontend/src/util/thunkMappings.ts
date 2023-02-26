import { AsyncThunkAction } from "@reduxjs/toolkit";
import { ExportFrom, ExportTo } from "../app/smsSlice";
import { ThunkAPI } from "../app/store";
import {
  importItems as importItemsToNotion,
  importSpotifyPlaylistsToNotion,
} from "../features/notion";
import {
  importItems as importItemsToSheets,
  importSpotifyPlaylistsToSheets,
} from "../features/sheets";
import { getSavedModels } from "../features/reddit";
import { getPlaylists } from "../features/spotify";
import {
  FeaturesOfSocialAppExport,
  FeaturesOfSpotifyExport,
  UrlAndFileNameThunkResponse,
} from "../features/types";
import { getTwitterBookmarks } from "../features/twitter";

export type GenuineExportFrom = Exclude<ExportFrom, "">;
export type GenuineExportTo = Exclude<ExportTo, "">;

const appToDownloadToLocal = {
  reddit: getSavedModels,
  spotify: getPlaylists,
  twitter: getTwitterBookmarks,
  youtube: getSavedModels, // TODO only for linters until the implementation is done
};

const getDownloadThunk = (appType: GenuineExportFrom) =>
  appToDownloadToLocal[appType];

export const getExportThunkAction = (
  exportFrom: GenuineExportFrom,
  exportTo: GenuineExportTo,
  initialExportProps: FeaturesOfSocialAppExport,
): AsyncThunkAction<
  UrlAndFileNameThunkResponse | string,
  FeaturesOfSocialAppExport | void,
  ThunkAPI
> => {
  if (exportTo === "download") return getDownloadThunk(exportFrom)();
  if (exportTo === "sheets") {
    if (exportFrom === "spotify") {
      return importSpotifyPlaylistsToSheets(
        initialExportProps as FeaturesOfSpotifyExport,
      );
    } // same thunk for both reddit saved models and twitter bookmarks
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
