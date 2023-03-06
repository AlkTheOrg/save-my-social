import axios from "axios";
import { SHEETS_BACEND } from "../../constants/apiEndpoints";
import {
  ImportItemsIntoSheetsPayload,
  ImportItemsIntoSheetsResponse,
} from "./endpointTypes";

export const importItemsToSheets = (payload: ImportItemsIntoSheetsPayload) =>
  axios.post<ImportItemsIntoSheetsResponse>(
    `${SHEETS_BACEND}/importItems`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
