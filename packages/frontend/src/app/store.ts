import { configureStore } from "@reduxjs/toolkit";
import smsReducer from "./smsSlice";
import windowOpenerReducer from "../features/windowOpener";

export const store = configureStore({
  reducer: {
    sms: smsReducer,
    windowOpener: windowOpenerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type ThunkAPI = {
  dispatch: AppDispatch,
  state: RootState,
}
