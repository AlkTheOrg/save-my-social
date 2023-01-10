import { FeaturesOfSocialAppExport } from "../types";

export type ImportItemsToNotionResponse = {
  dbURL: string,
  dbID: string,
  numOfImportedItems: number,
  lastQueriedItem: string,
};

export type ImportItemsToNotionPayload = {
  exportProps: FeaturesOfSocialAppExport,
  accessToken: string,
  accessTokenSocial: string,
  lastEditedDBID: string,
};
