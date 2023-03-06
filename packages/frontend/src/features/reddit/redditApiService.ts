import axios from "axios";
import { REDDIT_BACKEND } from "../../constants/apiEndpoints";
import { SavedModelResponse } from "./endpointTypes";

export const fetchSavedModels = (after = "") =>
  axios.post<SavedModelResponse>(
    `${REDDIT_BACKEND}/savedModels`,
    {
      after,
    },
  );
