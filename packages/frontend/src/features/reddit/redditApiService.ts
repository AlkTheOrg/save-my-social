import axios from "axios";
import { REDDIT_BACKEND } from "../../constants/apiEndpoints";

export const fetchAuthURL = () =>
  axios.get<{ url: string }>(`${REDDIT_BACKEND}/auth-url`);
