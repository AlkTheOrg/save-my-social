import { FeaturesOfSocialAppExport } from "../features/types";
import { GenuineExportFrom } from "./thunkMappings";

type ActiveExportApps = Exclude<
  GenuineExportFrom,
  "youtube" | "twitter"
>;

const initialMapping: Record<ActiveExportApps, FeaturesOfSocialAppExport> = {
  reddit: {
    reddit: { saved: { lastItemID: "" } },
  },
  spotify: {
    spotify: {
      playlist: {
        id: "",
        offset: 0,
      },
    },
  },
};

const exportPropsGetter = (app: ActiveExportApps) => initialMapping[app];

export default exportPropsGetter;
