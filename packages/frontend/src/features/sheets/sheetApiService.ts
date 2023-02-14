import axios from "axios";
import { GOOGLE_BACEND, SHEETS_BACEND } from "../../constants/apiEndpoints";
import {
  FetchAuthURLResponse,
  ImportItemsIntoSheetsPayload,
  ImportItemsIntoSheetsResponse,
} from "./endpointTypes";

export const fetchAuthURL = () =>
  axios.get<FetchAuthURLResponse>(`${GOOGLE_BACEND}/auth-url`);

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
