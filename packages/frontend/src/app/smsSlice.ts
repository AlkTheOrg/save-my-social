import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SmsApp =
  | ""
  | "reddit"
  | "spotify"
  | "twitter"
  | "youtube"
  | "notion"
  | "sheets"
  | "drive";

export type ExportFrom = Exclude<SmsApp, "notion" | "sheets" | "drive">;
export type ExportTo = SmsApp | "download";
export type AppPhase =
  | "idle"
  | "exportFromSelected"
  | "actionsSelected"
  | "exportToSelected"
  | "exportStarted"
  | "exportFinished"
  | "exportFailed";

export interface SmsState {
  exportFrom: ExportFrom;
  exportTo: ExportTo;
  curPhase: AppPhase;
  curStep: number;
  numOfSteps: number;
  apps: string[];
  apiUrl: string;
}

const initialState: SmsState = {
  exportFrom: "",
  exportTo: "",
  curPhase: "idle",
  curStep: 0,
  numOfSteps: 5,
  apps: ["reddit", "spotify", "twitter", "youtube", "sheets", "drive"],
  apiUrl: "http://localhost:5000",
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
    setCurState: (state, action: PayloadAction<AppPhase>) => {
      state.curPhase = action.payload;
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
  },
});

export const {
  setExportFrom,
  setExportTo,
  setCurState,
  incrementCurStep,
  decrementCurStep,
  resetCurStep,
} = smsSlice.actions;

export default smsSlice.reducer;
