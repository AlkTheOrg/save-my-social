import { FeaturesOfSocialAppExport } from "../types";

export type ImportItemsToNotionResponse = {
  dbURL: string,
  dbID: string,
  numOfImportedItems: number,
  newExportProps: FeaturesOfSocialAppExport,
  totalNumOfImportedItems: number,
};

export type ImportItemsToNotionPayload = {
  exportProps: FeaturesOfSocialAppExport,
  lastEditedDBID: string,
};
