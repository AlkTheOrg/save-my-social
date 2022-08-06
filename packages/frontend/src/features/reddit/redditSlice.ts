import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REDDIT_ENDPOINT } from "../../constants/apiEndpoints";
import { fetchAuthURL } from "./redditApiService";

export interface RedditState {
  name: string;
  tokens: [exporter: string, importer: string];
  selections: string[]; // todo
  importableTo: string[]; // todo
  authURL: string;
  isLoading: boolean;
  message: string;
}

const initialState: RedditState = {
  name: "reddit",
  tokens: ["", ""],
  selections: [],
  importableTo: ["download", "reddit", "drive", "sheets"],
  authURL: "",
  isLoading: false,
  message: "",
};

export const getAuthURL = createAsyncThunk("reddit/fetchOtt", async () => {
  const response = await fetchAuthURL();
  console.log("fetchAuthUrl:", response.data);
  return response.data.url;
});

export const redditSlice = createSlice({
  name: "reddit",
  initialState,
  reducers: {
    setExporterToken: (state, action: PayloadAction<string>) => {
      state.tokens[0] = action.payload;
    },
    setImporterToken: (state, action: PayloadAction<string>) => {
      state.tokens[1] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuthURL.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authURL = action.payload;
        state.message = "";
      })
      .addCase(getAuthURL.pending, (state) => {
        state.isLoading = true;
        state.message = "Getting the auth URL...";
      })
      .addCase(getAuthURL.rejected, (state) => {
        state.isLoading = false;
        state.message = "Error: Could no get Auth URL";
      });
  },
});

export default redditSlice.reducer;
export const { setExporterToken, setImporterToken } = redditSlice.actions;
