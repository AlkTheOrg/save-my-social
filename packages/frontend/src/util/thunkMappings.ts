import { AsyncThunkAction } from "@reduxjs/toolkit";
import { ExportFrom, ExportTo } from "../app/smsSlice";
import { ThunkAPI } from "../app/store";
import { importItems as importItemsToNotion } from "../features/notion/notionSlice";
import { getSavedModels } from "../features/reddit/redditSlice";
import { GetSavedModelsThunkResponse } from "../features/reddit/types";
import { FeaturesOfSocialAppExport } from "../features/types";

export type GenuineExportFrom = Exclude<ExportFrom, "">;
export type GenuineExportTo = Exclude<ExportTo, "">;

const appToDownloadToLocal = {
  reddit: getSavedModels,
  spotify: getSavedModels, // TODO only for linters until the implementation is done
  twitter: getSavedModels,
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
  // TODO: Whenn all exports are supported, abstract here to a mapping obj
  return importItemsToNotion(initialExportProps);
};
