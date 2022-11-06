import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuthURL as getRedditAuthURL } from "../features/reddit/redditSlice";

export type SmsApp =
  | ""
  | "reddit"
  | "spotify"
  | "twitter"
  | "youtube"
  | "notion"
  | "sheets"
  | "drive"
  | "download";

export type ExportFrom = Exclude<
  SmsApp,
  "notion" | "sheets" | "drive" | "download"
>;
export type ExportTo = SmsApp;

export interface SmsState {
  exportFrom: ExportFrom;
  exportTo: ExportTo;
  curStep: number;
  numOfSteps: number;
  apps: SmsApp[];
  activeApps: SmsApp[];
  authURLs: [toExport: string, toImport: string]; // i.e. [<redditURL>, <sheetsURL>].
  tokens: [toExport: string, toImport: string];
  isLoading: boolean;
  message: string;
}

export const appsToExportFrom = [
  "reddit",
  "spotify",
  "twitter",
  "youtube",
] as ExportFrom[];
export const appsToImportTo = [
  "reddit",
  "spotify",
  "twitter",
  "youtube",
  "notion",
  "sheets",
  "drive",
  "download",
] as ExportTo[];
export const allApps = [...appsToExportFrom, ...appsToImportTo] as SmsApp[];

const initialState: SmsState = {
  exportFrom: "",
  exportTo: "",
  curStep: 0,
  numOfSteps: 5,
  apps: allApps,
  activeApps: appsToExportFrom,
  authURLs: ["", ""],
  tokens: ["", ""],
  isLoading: false,
  message: "",
};

export const smsSlice = createSlice({
  name: "sms",
  initialState,
  reducers: {
    setExportFrom: (state, action: PayloadAction<ExportFrom>) => {
      state.exportFrom = action.payload;
    },
    setExportTo: (state, action: PayloadAction<ExportTo>) => {
      state.exportTo = action.payload;
    },
    incrementCurStep: (state) => {
      state.curStep += 1;
    },
    decrementCurStep: (state) => {
      state.curStep -= 1;
    },
    resetCurStep: (state) => {
      state.curStep = 0;
    },
    setToken(state, action: PayloadAction<string>) {
      const index = state.curStep >= 1 ? 1 : 0;
      state.tokens[index] = action.payload;
      state.curStep += 1;
    },
    resetMessage: (state) => {
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRedditAuthURL.fulfilled, (state, action) => {
        if (!state.authURLs[0]) {
          state.authURLs[0] = action.payload;
        } else {
          state.authURLs[1] = action.payload;
        }
        state.isLoading = false;
        smsSlice.caseReducers.resetMessage(state);
      })
      .addCase(getRedditAuthURL.pending, (state) => {
        state.isLoading = true;
        state.message = "Getting Reddit redirection URL.";
      })
      .addCase(getRedditAuthURL.rejected, (state) => {
        state.isLoading = false;
        state.message = "Error on getting the Auth URL for Reddit";
      });
  },
});

export const {
  setExportFrom,
  setExportTo,
  incrementCurStep,
  decrementCurStep,
  resetCurStep,
  setToken,
  resetMessage
} = smsSlice.actions;

export default smsSlice.reducer;
