import axios from "axios";
import { REDDIT_BACKEND } from "../../constants/apiEndpoints";

export const fetchAuthURL = () => axios.get<{ url: string }>(`${REDDIT_BACKEND}/auth-url`);

//* Corresponds to ProcessedSavedChildren in api
export type SavedModel = {
  id: string,
  kind: "Comment" | "Post",
  kindID: string,
  subreddit: string,
  title: string,
  over_18: boolean,
  permalink: string,
  link: string,
};

type SavedModelsResponse = {
  models: SavedModel[],
  lastQueried: string,
};

export const fetchSavedModels = (accessToken: string, after = "") =>
  axios.post<SavedModelsResponse>(
    `${REDDIT_BACKEND}/savedModels`,
    {
      accessToken,
      after,
    },
  );
