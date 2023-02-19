import axios from "axios";
import { REDDIT_BACKEND } from "../../constants/apiEndpoints";
import { SavedModelResponse } from "./endpointTypes";

export const fetchAuthURL = () =>
  axios.get<{ url: string }>(`${REDDIT_BACKEND}/auth-url`);

export const fetchSavedModels = (after = "") =>
  axios.post<SavedModelResponse>(
    `${REDDIT_BACKEND}/savedModels`,
    {
      after,
    },
  );
