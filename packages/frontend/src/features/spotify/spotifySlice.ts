import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAuthURL } from "./spotifyApiService";

const initialState = {
  name: "spotify",
  selections: ["playlist"],
};

export const getAuthURL = createAsyncThunk("spotify/authURL", async () => {
  const response = await fetchAuthURL();
  console.log("fetchAuthUrl:", response.data);
  return response.data.url;
});

export const redditSlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {},
});

export default redditSlice.reducer;
