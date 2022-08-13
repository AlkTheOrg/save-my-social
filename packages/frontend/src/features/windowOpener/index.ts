import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuthURL as getRedditAuthURL } from "../reddit/redditSlice";

export const windowSlice = createSlice({
  name: "windowOpener",
  initialState: {
    target: "",
    isOpened: false,
  },
  reducers: {
    opened: (state, action: PayloadAction<string>) => {
      state.isOpened = true;
      state.target = action.payload;
    },
    closed: (state) => {
      state.isOpened = false;
    },
    clear: (state) => {
      state.isOpened = false;
      state.target = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRedditAuthURL.fulfilled, (state, action) => {
        state.isOpened = true;
        state.target = action.payload;
      });
  },
});
export const { opened, closed } = windowSlice.actions;
export default windowSlice.reducer;
