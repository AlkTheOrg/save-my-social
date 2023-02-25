import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAuthURL } from "./twitterApiService";

export const getAuthURL = createAsyncThunk("twitter/authURL", async () => {
  const response = await fetchAuthURL();
  return response.data.url;
});

/* export const checkIfTwitterAccessTokenIsSet = createAsyncThunk<
  "Yes" | "No" | "NotTwitter", // return type
  void,
  ThunkAPI
>(
  "twitter/checkIfAccessTokenIsSet",
  async (_, { getState, dispatch }) => {
    const { exportFrom, exportTo } = getState().sms;
    if (
      (!exportTo && exportFrom === "twitter") // if twitter is selected as the first app
      || (exportTo && exportTo === "twitter") // if selected as second
    ) {
      const response = await accessTokenIsSet();
      if (response.data) {
        dispatch(setToken("true"));
        return "Yes";
      }
      return "No";
    }
    return "NotTwitter";
  },
); */
