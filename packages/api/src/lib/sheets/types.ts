import { FeaturesOfSocialAppExport, ReqBodyWithAccessToken, ReqBodyWithExportProps_Deprecated } from "../../controllers/types.js";

export interface ReqBodyWithLastEditedSpreadsheetID extends ReqBodyWithExportProps_Deprecated {
  accessTokenSocial: string,
  lastSpreadsheetID?: string,
  lastSheetName?: string,
  totalNumOfImportedItems?: number
};

export type ImportDataIntoSheetResponse = {
  spreadsheetId: string,
  lastSheetName: string,
  numOfImportedItems: number,
  totalNumOfItems: number, // -1 represents unknown
  newExportProps: FeaturesOfSocialAppExport,
}

export interface ReqBodyOfGetPlaylistTracks extends ReqBodyWithAccessToken {
  playlistId: string,
  offset?: number,
}
