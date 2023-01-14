import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setMessage } from "../../app/smsSlice";
import { ThunkAPI } from "../../app/store";
import { FeaturesOfSocialAppExport } from "../types";
import { fetchAuthURL, importItemsToSheets } from "./sheetApiService";

const initialState: { name: string } = {
  name: "sheets",
};

export const getAuthURL = createAsyncThunk("sheets/fetchOtt", async () => {
  const response = await fetchAuthURL();
  return response.data.url;
});

const recursivelyImportToSheets = async (
  accessTokenToExport: string,
  accessTokenToImport: string,
  exportProps: FeaturesOfSocialAppExport,
  beforeImport: (totalFetchedAmount: number) => void,
  afterImport: (totalFetchedAmount: number, numOfImportedItems: number) => void,
  lastSpreadsheetID = "",
  lastSheetName = "",
  totalFetchedAmount = 0,
): Promise<string> => {
  beforeImport(totalFetchedAmount);

  const payload = {
    accessToken: accessTokenToImport,
    accessTokenSocial: accessTokenToExport,
    exportProps,
    lastSpreadsheetID,
    lastSheetName,
    totalNumOfImportedItems: totalFetchedAmount,
  };

  const {
    data: {
      lastSheetName: newLastSheetName,
      newExportProps,
      numOfImportedItems,
      spreadsheetId,
      // totalNumOfItems, // TODO: If not -1, use while setting the redux msg
    },
  } = await importItemsToSheets(payload);

  afterImport(totalFetchedAmount, numOfImportedItems);

  // if (lastQueriedItem)
  if (numOfImportedItems === 100) {
    const url = await recursivelyImportToSheets(
      accessTokenToExport,
      accessTokenToImport,
      newExportProps,
      beforeImport,
      afterImport,
      spreadsheetId,
      newLastSheetName,
      totalFetchedAmount + numOfImportedItems,
    );
    return url;
  }
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
};

export const importItems = createAsyncThunk<
  string, // return type
  FeaturesOfSocialAppExport,
  ThunkAPI
>(
  "sheets/importItems",
  async (initialExportProps, { getState, dispatch }) => {
    const {
      sms: {
        tokens: [toExport, toImport],
      },
    } = getState();

    const beforeImport = (totalFetchedAmount: number) => dispatch(setMessage(
      `Importing items from ${totalFetchedAmount} to ${totalFetchedAmount + 100}`,
    ));
    const afterImport = (totalFetchedAmount: number, numOfImportedItems: number) =>
      dispatch(setMessage(
        `Successfully imported items from ${totalFetchedAmount} to ${
          totalFetchedAmount + numOfImportedItems
        }`,
      ));

    const spreadsheetURL = await recursivelyImportToSheets(
      toExport,
      toImport,
      initialExportProps,
      beforeImport,
      afterImport,
      "",
      "",
    );

    return spreadsheetURL;
  },
);

export const sheetsSlice = createSlice({
  name: "sheets",
  initialState,
  reducers: {},
});

export default sheetsSlice.reducer;
