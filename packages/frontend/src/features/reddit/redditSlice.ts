import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAuthURL } from "./redditApiService";
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

export const redditSlice = createSlice({
  name: "reddit",
  initialState,
  reducers: {},
});

export default redditSlice.reducer;
