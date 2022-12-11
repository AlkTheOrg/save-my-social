import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setMessage } from "../../app/smsSlice";
import { AppDispatch, RootState } from "../../app/store";
import { ImportItemsToNotionPayload } from "./endpointTypes";
import {
  fetchAuthURL,
  importItemsToNotion,
} from "./notionApiService";
import { ExportPropsGetter } from "./types";

const initialState: { name: string } = {
  name: "notion",
};

export const getAuthURL = createAsyncThunk("notion/fetchOtt", async () => {
  const response = await fetchAuthURL();
  console.log("fetchAuthURL notion:", response.data);
  return response.data.url;
});

const importItemsPayloadCreator = (
  accessToken: string,
  accessTokenSocial: string,
  exportPropsGetter: ExportPropsGetter,
  lastEditedDBID: string,
  lastItemID: string,
): ImportItemsToNotionPayload => ({
  exportProps: exportPropsGetter(lastItemID),
  accessToken,
  accessTokenSocial,
  lastEditedDBID,
});

export const importItems = createAsyncThunk<
  string, // return type
  ExportPropsGetter, // type of first argument
  {
    dispatch: AppDispatch;
    state: RootState;
    // extra: { },
  }
>(
  "notion/importItems",
  async (exportPropsGetter, { getState, dispatch }) => {
    const {
      sms: {
        tokens: [toExport, toImport],
      },
    } = getState();

    let importedDBURL = "";

    const recursivelyImportToNotion = async (
      lastItemID = "",
      lastEditedDBID = "",
      totalFetchedAmount = 0,
    ) => {
      dispatch(setMessage(
        `Importing items from ${totalFetchedAmount} to ${totalFetchedAmount + 100}`,
      ));
      const payload = importItemsPayloadCreator(
        toImport,
        toExport,
        exportPropsGetter,
        lastEditedDBID,
        lastItemID,
      );
      const {
        data: {
          dbURL, dbID, numOfImportedItems, lastQueriedItem,
        },
      } = await importItemsToNotion(payload);

      dispatch(setMessage(
        `Successfully imported items from ${totalFetchedAmount} to ${
          totalFetchedAmount + numOfImportedItems
        }`,
      ));

      // if (lastQueriedItem) {
      if (numOfImportedItems === 100) {
        await recursivelyImportToNotion(
          lastQueriedItem,
          dbID,
          totalFetchedAmount + numOfImportedItems,
        );
      } else {
        importedDBURL = dbURL;
      }
    };
    await recursivelyImportToNotion("", "", 0);

    return importedDBURL;
  },
);

export const notionSlice = createSlice({
  name: "notion",
  initialState,
  reducers: {},
});

export default notionSlice.reducer;
