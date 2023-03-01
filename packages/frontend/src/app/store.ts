import { combineReducers, configureStore, PreloadedState } from "@reduxjs/toolkit";
import smsReducer from "./smsSlice";
import windowOpenerReducer from "../features/windowOpener";

// exported for test-utils.tsx
export const rootReducer = combineReducers({
  sms: smsReducer,
  windowOpener: windowOpenerReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]

export type ThunkAPI = {
  dispatch: AppDispatch,
  state: RootState,
}
