import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAuthURL } from "./redditApiService";

export interface RedditState {
  name: string;
  selections: string[]; // todo
  importableTo: string[]; // todo
}

const initialState: RedditState = {
  name: "reddit",
  selections: [],
  importableTo: ["download", "reddit", "drive", "sheets"],
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
