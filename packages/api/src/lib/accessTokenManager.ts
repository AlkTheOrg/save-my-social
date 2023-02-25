import { ActiveApp } from "../controllers/types.js";

const accessTokens: Record<ActiveApp, string> = {
  reddit: '',
  spotify: '',
  notion: '',
  sheets: '',
  twitter: '',
};

export const setAccessToken = (app: ActiveApp, token: string) => accessTokens[app] = token;

export const getAccessToken = (app: ActiveApp) => accessTokens[app];
