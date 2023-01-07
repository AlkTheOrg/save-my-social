import { ReqBodyWithExportProps } from "../../controllers/types.js";

export interface ReqBodyWithLastEditedSpreadsheetID extends ReqBodyWithExportProps {
  accessTokenSocial: string,
  lastSpreadsheetID?: string,
  lastSheetName?: string,
};
