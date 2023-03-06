import { createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../../app/smsSlice";
import { ThunkAPI } from "../../app/store";
import { prepareBlobURL } from "../../util";
import { UrlAndFileNameThunkResponse } from "../types";
import { fetchTwitterBookmarks } from "./twitterApiService";
import { TweetResponse } from "./types";

export const getTwitterBookmarks = createAsyncThunk<
  UrlAndFileNameThunkResponse,
  void,
  ThunkAPI
>(
  "twitter/getTwitterBookmarks",
  async (_, { dispatch }) => {
    const recursivelyCollectItems = async (
      items: TweetResponse[],
      paginationToken?: string,
    ) => {
      dispatch(setMessage(
        `Getting tweets from ${items.length} to ${items.length + 100}.`,
      ));

      const {
        data: { nextToken, resultCount, tweets },
      } = await fetchTwitterBookmarks(paginationToken);

      items.push(...tweets);

      dispatch(setMessage(
        `Successfully imported tweets from ${items.length} to ${
          items.length + resultCount
        }`,
      ));

      // if there may be more to fetch
      if (resultCount === 100) {
        await recursivelyCollectItems(items, nextToken);
      }
    };

    const items = [] as TweetResponse[];
    await recursivelyCollectItems(items);
    const fileName = "twitter_bookmarks.json";
    const url = prepareBlobURL(items, "application/json");
    return { url, fileName };
  },
);

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
