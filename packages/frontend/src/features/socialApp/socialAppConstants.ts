import { ExportFrom, ExportTo } from "../../app/smsSlice";

const appsExportableToMapping: Record<ExportFrom, Partial<ExportTo>[]> = {
  "": [],
  reddit: ["download", "notion", "sheets"],
  spotify: ["download", "notion", "sheets"],
  twitter: [],
  youtube: [],
};

export const getExportableTargetsOfCurApp = (curApp: ExportFrom): Partial<ExportTo>[] =>
  appsExportableToMapping[curApp];
