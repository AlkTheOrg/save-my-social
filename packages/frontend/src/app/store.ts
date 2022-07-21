import { configureStore } from "@reduxjs/toolkit";
import smsReducer from "./smsSlice";
import redditReducer from "../features/reddit/redditSlice";

export const store = configureStore({
  reducer: {
    sms: smsReducer,
    reddit: redditReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
