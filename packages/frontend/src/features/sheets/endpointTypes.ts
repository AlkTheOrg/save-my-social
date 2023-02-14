import { FeaturesOfSocialAppExport } from "../types";

export type FetchAuthURLResponse = {
  url: string,
};

export type ImportItemsIntoSheetsPayload = {
  exportProps: FeaturesOfSocialAppExport,
  accessToken: string,
  accessTokenSocial: string,
  lastSpreadsheetID?: string,
  lastSheetName?: string,
  totalNumOfImportedItems?: number
};

export type ImportItemsIntoSheetsResponse = {
  spreadsheetId: string,
  lastSheetName: string,
  numOfImportedItems: number,
  totalNumOfItems: number, // -1 represents unknown
  newExportProps: FeaturesOfSocialAppExport,
}
