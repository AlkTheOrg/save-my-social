import { ExportFrom, ExportTo, SmsApp } from "../../app/smsSlice";

const appsExportableToMapping: Record<ExportFrom, Partial<ExportTo>[]> = {
  "": [],
  reddit: ["download", "notion", "sheets"],
  spotify: ["download", "notion", "sheets"],
  twitter: ["download", "notion", "sheets"],
  youtube: [],
};

type AppInfo = {
  title: string,
  appName: SmsApp,
  isAppDisabled?: boolean,
  disabledText?: string
};
const appInfoMapping: Record<SmsApp, AppInfo> = {
  "": { title: "Empty", appName: "" },
  reddit: { title: "Reddit Bookmarks", appName: "reddit" },
  spotify: { title: "Spotify Playlists", appName: "spotify" },
  twitter: { title: "Twitter Bookmarks", appName: "twitter" },
  youtube: {
    title: "Youtube Playlists",
    appName: "youtube",
    isAppDisabled: true,
    disabledText: "Soon",
  },
  download: { title: "Download", appName: "download" },
  notion: { title: "Notion", appName: "notion" },
  sheets: { title: "Sheets", appName: "sheets" },
};

export const getExportableTargetsOfCurApp = (curApp: ExportFrom): Partial<ExportTo>[] =>
  appsExportableToMapping[curApp];

export const getAppInfo = (curApp: SmsApp) =>
  appInfoMapping[curApp];
