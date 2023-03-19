import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
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
  async (_, { dispatch, rejectWithValue }) => {
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

    try {
      const items = [] as TweetResponse[];
      await recursivelyCollectItems(items);
      const fileName = "twitter_bookmarks.json";
      const url = prepareBlobURL(items, "application/json");
      return { url, fileName };
    } catch (_err) {
      const error = _err as AxiosError;
      return rejectWithValue({
        msg: (error.response?.data as { msg: string })?.msg || error.message,
      });
    }
  },
);
