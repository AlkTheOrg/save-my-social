import axios from "axios";
import { TWITTER_BACEND } from "../../constants/apiEndpoints";
import { GetBookmarksResponse } from "./types";

export const fetchAuthURL = () =>
  axios.get<{ url: string }>(`${TWITTER_BACEND}/auth-url`);

export const accessTokenIsSet = () =>
  axios.get<boolean>(`${TWITTER_BACEND}/accessTokenIsSet`);

export const fetchTwitterBookmarks = (paginationToken = "") =>
  axios.post<GetBookmarksResponse>(
    `${TWITTER_BACEND}/bookmarks`,
    {
      pagination_token: paginationToken,
    },
  );
