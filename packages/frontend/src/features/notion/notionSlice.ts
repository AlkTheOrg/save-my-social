import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FeaturesOfSocialAppExport } from "../types";
import { setMessage } from "../../app/smsSlice";
import { ThunkAPI } from "../../app/store";
import { ImportItemsToNotionPayload } from "./endpointTypes";
import {
  fetchAuthURL,
  importItemsToNotion,
} from "./notionApiService";

const initialState: { name: string } = {
  name: "notion",
};

export const getAuthURL = createAsyncThunk("notion/authURL", async () => {
  const response = await fetchAuthURL();
  console.log("fetchAuthURL notion:", response.data);
  return response.data.url;
});

export const importItems = createAsyncThunk<
  string, // return type
  FeaturesOfSocialAppExport, // type of first argument
  ThunkAPI
>(
  "notion/importItems",
  async (initialExportProps, { dispatch }) => {
    let importedDBURL = "";

    const recursivelyImportToNotion = async (
      exportProps: FeaturesOfSocialAppExport,
      lastEditedDBID = "",
      totalFetchedAmount = 0,
    ) => {
      dispatch(setMessage(
        `Importing items from ${totalFetchedAmount} to ${totalFetchedAmount + 100}`,
      ));

      const payload: ImportItemsToNotionPayload = {
        lastEditedDBID,
        exportProps,
      };

      const {
        data: {
          dbURL, dbID, numOfImportedItems, newExportProps,
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
          newExportProps,
          dbID,
          totalFetchedAmount + numOfImportedItems,
        );
      } else {
        importedDBURL = dbURL;
      }
    };
    await recursivelyImportToNotion(initialExportProps, "", 0);

    return importedDBURL;
  },
);

export const notionSlice = createSlice({
  name: "notion",
  initialState,
  reducers: {},
});

export default notionSlice.reducer;
