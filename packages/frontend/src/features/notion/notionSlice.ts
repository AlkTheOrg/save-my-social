import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAuthURL } from "./notionApiService";

const initialState: { name: string } = {
  name: "notion",
};

export const getAuthURL = createAsyncThunk("notion/fetchOtt", async () => {
  const response = await fetchAuthURL();
  console.log("fetchAuthURL notion:", response.data);
  return response.data.url;
});

export const notionSlice = createSlice({
  name: "notion",
  initialState,
  reducers: {},
});

export default notionSlice.reducer;
