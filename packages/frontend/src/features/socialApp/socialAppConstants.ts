import { ExportFrom, ExportTo } from "../../app/smsSlice";

const appsExportableToMapping: Record<ExportFrom, Partial<ExportTo>[]> = {
  "": [],
  reddit: ["download", "reddit", "notion", "sheets"],
  spotify: ["download", "spotify", "notion", "sheets"],
  twitter: [],
  youtube: [],
};

export const getExportableTargetsOfCurApp = (curApp: ExportFrom): Partial<ExportTo>[] =>
  appsExportableToMapping[curApp];
