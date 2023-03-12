import { toast } from "react-toastify";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSavedModels } from "../features/reddit";
import {
  importItems as importItemsToNotion,
  importSpotifyPlaylistsToNotion,
} from "../features/notion";
import {
  importItems as importItemsToSheets,
  importSpotifyPlaylistsToSheets,
} from "../features/sheets";
import { getPlaylists } from "../features/spotify";
import { getTwitterBookmarks } from "../features/twitter";
import {
  Steps,
  stepsByOrder,
  numOfSteps,
  getNextStep,
} from "./steps";
import { getAuthURL } from "../features/windowOpener";

export type SmsApp =
  | ""
  | "reddit"
  | "spotify"
  | "twitter"
  | "youtube"
  | "notion"
  | "sheets"
  | "download";

export type ExportFrom = Exclude<SmsApp, "notion" | "sheets" | "download">;
export type ExportTo = SmsApp;

export type SelectionContext = "exportFrom" | "exportTo";

export interface SmsState {
  exportFrom: ExportFrom;
  exportTo: ExportTo;
  curSelectionContext: SelectionContext;
  apps: SmsApp[];
  activeApps: SmsApp[];
  areTokensSet: [toExport: boolean, toImport: boolean];
  isLoading: boolean;
  isError: boolean;
  message: string;
  finalURL: string;
  finalFileName: string;
  isConfirmModalOpen: boolean;
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
  curSelectionContext: "exportFrom",
  apps: allApps,
  activeApps: appsToExportFrom,
  areTokensSet: [false, false],
  isLoading: false,
  isError: false,
  message: "",
  steps: stepsByOrder,
  finalURL: "",
  finalFileName: "",
  isConfirmModalOpen: false,
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
    setCurSelectionContext: (state, action: PayloadAction<SelectionContext>) => {
      state.curSelectionContext = action.payload;
    },
    setToken: (state, action: PayloadAction<"true" | "false">) => {
      const index = state.curSelectionContext === "exportFrom" ? 0 : 1;
      state.areTokensSet[index] = action.payload === "true";
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
    setStep: (state, action: PayloadAction<number>) => {
      state.curStep = action.payload;
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
    setError: (state, action: PayloadAction<string>) => {
      state.isError = true;
      state.message = action.payload;
      toast.error(action.payload);
      // eslint-disable-next-line no-console
      console.log(action.payload);
    },
    toggleConfirmModal: (state) => {
      state.isConfirmModalOpen = !state.isConfirmModalOpen;
    },
  },
  extraReducers: (builder) => {
    const thunks = [
      importItemsToNotion,
      importItemsToSheets,
      getSavedModels,
      getTwitterBookmarks,
      getPlaylists,
      importSpotifyPlaylistsToNotion,
      importSpotifyPlaylistsToSheets,
    ];
    thunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.isError = false;
          state.isLoading = true;
        })
        .addCase(thunk.rejected, (state, result) => {
          state.isLoading = false;
          state.isError = true;
          state.message = result.error.message || "Something went wrong";
          toast.error(state.message);
        });
    });

    [
      importItemsToNotion.fulfilled,
      importItemsToSheets.fulfilled,
      importSpotifyPlaylistsToSheets.fulfilled,
      importSpotifyPlaylistsToNotion.fulfilled,
    ].forEach((fullfilledThunk) => {
      builder.addCase(fullfilledThunk, (state, { payload }) => {
        state.isLoading = false;
        state.curStep += 1;
        state.finalURL = payload;
      });
    });

    [
      getSavedModels.fulfilled,
      getTwitterBookmarks.fulfilled,
      getPlaylists.fulfilled,
    ].forEach((fulfilledThunk) => {
      builder.addCase(fulfilledThunk, (state, { payload }) => {
        state.isLoading = false;
        state.isError = false;
        state.curStep += 1;
        state.finalURL = payload.url;
        state.finalFileName = payload.fileName;
      });
    });

    builder
      .addCase(getAuthURL.fulfilled, (state) => {
        state.isLoading = false;
        smsSlice.caseReducers.resetMessage(state);
      })
      .addCase(getAuthURL.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
        state.message = "Getting the Auth URL.";
      })
      .addCase(getAuthURL.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.message = "Error on getting the Auth URL.";
      });
  },
});

export const {
  setExportFrom,
  setExportTo,
  setCurSelectionContext,
  setToken,
  setActiveApps,
  setMessage,
  resetMessage,
  incrementCurStep,
  setStep,
  clickOnFinishedStepLink,
  reset,
  setError,
  toggleConfirmModal,
} = smsSlice.actions;

export default smsSlice.reducer;
