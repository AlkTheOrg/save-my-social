import axios from "axios";
import { REDDIT_BACKEND } from "../../constants/apiEndpoints";

export const fetchAuthURL = (): Promise<{ data: { url: string } }> =>
  axios.get(`${REDDIT_BACKEND}/auth-url`);
