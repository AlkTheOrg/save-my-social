import axios from "axios";
import { NOTION_BACKEND } from "../../constants/apiEndpoints";
import {
  ImportItemsToNotionPayload,
  ImportItemsToNotionResponse,
} from "./endpointTypes";

export const importItemsToNotion = (payload: ImportItemsToNotionPayload) =>
  axios.post<ImportItemsToNotionResponse>(
    `${NOTION_BACKEND}/importItems`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
