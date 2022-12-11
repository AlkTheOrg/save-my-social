import { configureStore } from "@reduxjs/toolkit";
import smsReducer from "./smsSlice";
import redditReducer from "../features/reddit/redditSlice";
import windowOpenerReducer from "../features/windowOpener";

export const store = configureStore({
  reducer: {
    sms: smsReducer,
    reddit: redditReducer,
    windowOpener: windowOpenerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type ThunkAPI = {
  dispatch: AppDispatch,
  state: RootState,
}
