import { FeaturesOfSocialAppExport } from "../types";

export type ImportItemsToNotionResponse = {
  dbURL: string,
  dbID: string,
  numOfImportedItems: number,
  newExportProps: FeaturesOfSocialAppExport,
  totalNumOfItems: number,
  lastEditedPageId?: string,
};

export type ImportItemsToNotionPayload = {
  exportProps: FeaturesOfSocialAppExport,
  lastEditedDBID: string,
  lastEditedPageId?: string,
};
