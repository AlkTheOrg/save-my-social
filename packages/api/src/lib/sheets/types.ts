import { FeaturesOfSocialAppExport, ReqBodyWithExportProps } from "../../controllers/types.js";

export interface ReqBodyWithLastEditedSpreadsheetID extends ReqBodyWithExportProps {
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
