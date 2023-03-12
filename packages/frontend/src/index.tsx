import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { setupStore } from "./app/store";
import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById("root")!;
const root = createRoot(container);

const isDevMode = false;
const Wrapper = isDevMode ? React.StrictMode : React.Fragment;

root.render(
  <Wrapper>
    <Provider store={setupStore()}>
      <App />
    </Provider>,
  </Wrapper>,
);
