import { AsyncThunk, AsyncThunkAction } from "@reduxjs/toolkit";
import { ExportFrom, ExportTo, SmsApp } from "../app/smsSlice";
import { ThunkAPI } from "../app/store";
import {
  importItems as importItemsToNotion,
  importSpotifyPlaylistsToNotion,
  getAuthURL as getNotionAuthURL,
} from "../features/notion";
import {
  importItems as importItemsToSheets,
  importSpotifyPlaylistsToSheets,
  getAuthURL as getSheetsAuthURL,
} from "../features/sheets";
import { getSavedModels, getAuthURL as getRedditAuthURL } from "../features/reddit";
import { getPlaylists, getAuthURL as getSpotifyAuthURL } from "../features/spotify";
import {
  FeaturesOfSocialAppExport,
  FeaturesOfSpotifyExport,
  UrlAndFileNameThunkResponse,
} from "../features/types";
import {
  getTwitterBookmarks,
  getAuthURL as getTwitterAuthURL,
} from "../features/twitter";

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
  // exportTo === "notion" && (exportFrom is either "reddit" or "twitter")
  return importItemsToNotion(initialExportProps);
};

// AUTH MAPPINGS
export type AppToAuthURLGetterMapping = Record<
  Exclude<SmsApp, "" | "download">,
  AsyncThunk<string, void, Record<string, unknown>>
>;

export const appToAuthURLGetterMapping: AppToAuthURLGetterMapping = {
  reddit: getRedditAuthURL,
  spotify: getSpotifyAuthURL,
  twitter: getTwitterAuthURL,
  youtube: getRedditAuthURL, // TODO: Update when implemented
  notion: getNotionAuthURL,
  sheets: getSheetsAuthURL,
};
