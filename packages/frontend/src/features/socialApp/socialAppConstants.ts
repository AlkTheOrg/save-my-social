import { ExportFrom, ExportTo } from "../../app/smsSlice";

const appsExportableToMapping: Record<ExportFrom, Partial<ExportTo>[]> = {
  "": [],
  reddit: ["download", "reddit", "notion", "sheets"],
  spotify: [],
  twitter: [],
  youtube: [],
};

export const getExportableTargetsOfCurApp = (curApp: ExportFrom): Partial<ExportTo>[] =>
  appsExportableToMapping[curApp];
