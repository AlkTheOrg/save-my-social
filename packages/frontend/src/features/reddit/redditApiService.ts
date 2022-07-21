import axios from "axios";
import { REDDIT_ENDPOINT } from "../../constants/apiEndpoints";

export const fetchAuthURL = (): Promise<{ data: { url: string } }> =>
  axios.get(`${REDDIT_ENDPOINT}/auth-url`);
