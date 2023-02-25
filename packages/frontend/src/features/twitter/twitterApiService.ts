import axios from "axios";
import { TWITTER_BACEND } from "../../constants/apiEndpoints";

export const fetchAuthURL = () =>
  axios.get<{ url: string }>(`${TWITTER_BACEND}/auth-url`);

export const accessTokenIsSet = () =>
  axios.get<boolean>(`${TWITTER_BACEND}/accessTokenIsSet`);
