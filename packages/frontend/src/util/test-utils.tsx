import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { render, RenderOptions } from "@testing-library/react";
import { PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";
import { AppStore, rootReducer, RootState } from "../app/store";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>,
  store?: AppStore
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({ reducer: rootReducer, preloadedState }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({
    children,
  }: PropsWithChildren<Record<string, unknown>>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
