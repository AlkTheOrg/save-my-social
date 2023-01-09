import { toast } from "react-toastify";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuthURL as getRedditAuthURL, getSavedModels } from "../features/reddit/redditSlice";
import {
  getAuthURL as getNotionAuthURL,
  importItems as importItemsToNotion,
} from "../features/notion/notionSlice";
import { getExportableTargetsOfCurApp } from "../features/socialApp/socialAppConstants";
import {
  Steps,
  stepsByOrder,
  numOfSteps,
  getNextStep,
} from "./steps";

export type SmsApp =
  | ""
  | "reddit"
  | "spotify"
  | "twitter"
  | "youtube"
  | "notion"
  | "sheets"
  | "download";

export type ExportFrom = Exclude<
  SmsApp,
    "notion" | "sheets" | "download"
>;
export type ExportTo = SmsApp;

export interface SmsState {
  exportFrom: ExportFrom;
  exportTo: ExportTo;
  apps: SmsApp[];
  activeApps: SmsApp[];
  tokens: [toExport: string, toImport: string];
  isLoading: boolean;
  isError: boolean;
  message: string;
  finalURL: string;
  finalFileName: string;
  // -- steps --
  steps: Steps,
  curStep: number,
  numOfSteps: number,
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
  "download",
] as ExportTo[];
export const allApps = [...appsToExportFrom, ...appsToImportTo] as SmsApp[];

const initialState: SmsState = {
  exportFrom: "",
  exportTo: "",
  apps: allApps,
  activeApps: appsToExportFrom,
  tokens: ["", ""],
  isLoading: false,
  isError: false,
  message: "",
  steps: stepsByOrder,
  finalURL: "",
  finalFileName: "",
  curStep: 0,
  numOfSteps,
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
    setToken: (state, action: PayloadAction<string>) => {
      const index = state.curStep >= 1 ? 1 : 0;
      state.tokens[index] = action.payload;
      // TODO: May get rid of below logic and use a new component for the next step
      if (index < 1) { // if token belongs to the first app
        const exportableTargetsOfCurApp = getExportableTargetsOfCurApp(state.exportFrom);
        state.activeApps = exportableTargetsOfCurApp;
      }
      smsSlice.caseReducers.incrementCurStep(state);
    },
    setActiveApps: (state, action: PayloadAction<SmsApp[]>) => {
      state.activeApps = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    resetMessage: (state) => {
      state.message = "";
    },
    incrementCurStep: (state) => {
      state.curStep = getNextStep(state.curStep);
    },
    clickOnFinishedStepLink: (
      { exportTo, finalURL, finalFileName },
      action: PayloadAction<string>,
    ) => {
      const finalLinkElement = document.querySelector(
        action.payload,
      ) as HTMLAnchorElement;
      if (!finalLinkElement) return; // !ERROR
      finalLinkElement.href = finalURL;
      if (exportTo === "download") finalLinkElement.download = finalFileName;
      finalLinkElement.click();
    },
    reset: ({ finalURL, exportTo }) => {
      if (finalURL && exportTo === "download") {
        URL.revokeObjectURL(finalURL);
      }
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRedditAuthURL.fulfilled, (state) => {
        state.isLoading = false;
        smsSlice.caseReducers.resetMessage(state);
      })
      .addCase(getRedditAuthURL.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
        state.message = "Getting Reddit redirection URL.";
      })
      .addCase(getRedditAuthURL.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.message = "Error on getting the Auth URL for Reddit";
      })
      .addCase(getNotionAuthURL.fulfilled, (state) => {
        state.isLoading = false;
        smsSlice.caseReducers.resetMessage(state);
      })
      .addCase(getNotionAuthURL.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Getting Notion redirection URL.";
      })
      .addCase(getNotionAuthURL.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.message = "Error on getting the Auth URL for Notion";
      })
      .addCase(importItemsToNotion.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(importItemsToNotion.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.curStep += 1;
        state.finalURL = payload;
      })
      .addCase(importItemsToNotion.rejected, (state, result) => {
        state.isLoading = false;
        state.isError = true;
        state.message = result.error.message || "Something went wrong";
        toast.error(state.message);
      })
      .addCase(getSavedModels.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getSavedModels.fulfilled, (state, result) => {
        state.isLoading = false;
        state.isError = false;
        state.curStep += 1;
        state.finalURL = result.payload.url;
        state.finalFileName = result.payload.fileName;
      })
      .addCase(getSavedModels.rejected, (state, result) => {
        state.isLoading = false;
        state.isError = true;
        state.message = result.error.message || "Something went wrong";
        toast.error(state.message);
      });
  },
});

export const {
  setExportFrom,
  setExportTo,
  setToken,
  setActiveApps,
  setMessage,
  resetMessage,
  incrementCurStep,
  clickOnFinishedStepLink,
  reset,
} = smsSlice.actions;

export default smsSlice.reducer;
