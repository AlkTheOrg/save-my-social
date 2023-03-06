import axios from "axios";
import { TWITTER_BACEND } from "../../constants/apiEndpoints";
import { GetBookmarksResponse } from "./types";

export const accessTokenIsSet = () =>
  axios.get<boolean>(`${TWITTER_BACEND}/accessTokenIsSet`);

export const fetchTwitterBookmarks = (paginationToken = "") =>
  axios.post<GetBookmarksResponse>(
    `${TWITTER_BACEND}/bookmarks`,
    {
      pagination_token: paginationToken,
    },
  );
