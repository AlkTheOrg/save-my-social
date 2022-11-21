import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAuthURL, fetchSavedModels } from "./redditApiService";
import { RedditState } from "./types";

const initialState: RedditState = {
  name: "reddit",
  selections: ["saved"],
};

export const getAuthURL = createAsyncThunk("reddit/fetchOtt", async () => {
  const response = await fetchAuthURL();
  console.log("fetchAuthUrl:", response.data);
  return response.data.url;
});

export const getSavedModels = createAsyncThunk(
  "reddit/getSavedModels",
  async (accessToken: string) => {
    const {
      data: { models: savedModels, lastQueried },
    } = await fetchSavedModels(accessToken);
    console.log(savedModels);
    console.log(lastQueried);
  },
);

export const redditSlice = createSlice({
  name: "reddit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSavedModels.fulfilled, (state, action) => {
      console.log(action.payload);
    });
  },
});

export default redditSlice.reducer;
