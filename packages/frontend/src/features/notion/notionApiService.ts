import axios from "axios";
import { NOTION_BACKEND } from "../../constants/apiEndpoints";

export const fetchAuthURL = () =>
  axios.get<{ url: string }>(`${NOTION_BACKEND}/auth-url`);
