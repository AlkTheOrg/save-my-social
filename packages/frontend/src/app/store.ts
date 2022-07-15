import { configureStore } from "@reduxjs/toolkit";
import smsReducer from "./smsSlice";

export const store = configureStore({
  reducer: {
    sms: smsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
