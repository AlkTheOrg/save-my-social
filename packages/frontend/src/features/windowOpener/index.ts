import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SmsApp } from "../../app/smsSlice";
import { ThunkAPI } from "../../app/store";
import { root } from "../../constants/apiEndpoints";

export const getAuthURL = createAsyncThunk<
  string,
  SmsApp,
  ThunkAPI
>("social/authURL", async (app) => {
  const response = await axios.get<{ url: string }>(`${root}/auth-url?app=${app}`);
  return response.data.url;
});

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
      .addCase(getAuthURL.fulfilled, (state, action) => {
        state.isOpened = true;
        state.target = action.payload;
      });
  },
});
export const { opened, closed } = windowSlice.actions;
export default windowSlice.reducer;
